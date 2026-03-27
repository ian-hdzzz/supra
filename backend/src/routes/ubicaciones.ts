import { Router, Request, Response } from "express";
import prisma from "../db/client";
import { haversineMetros, formatDistancia } from "../utils/haversine";

const router = Router();

// GET /api/ubicaciones/cercanas?lat=20.58&lng=-100.38&tipo=oficina&limite=5
router.get("/cercanas", async (req: Request, res: Response) => {
  const { lat, lng, tipo, limite } = req.query as { lat?: string; lng?: string; tipo?: string; limite?: string };

  if (!lat || !lng) {
    return res.status(400).json({ success: false, error: "Parámetros 'lat' y 'lng' requeridos" });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const maxResults = parseInt(limite || "5");

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ success: false, error: "Coordenadas inválidas" });
  }

  try {
    const where = tipo ? { tipo } : {};
    const ubicaciones = await prisma.ubicacion.findMany({ where });

    const tipoLabel: Record<string, string> = {
      oficina: "Oficina",
      cajero: "CEAmático",
      autopago: "Autopago",
    };

    // Calcular distancias, ordenar y limitar
    const conDistancia = ubicaciones
      .map(u => {
        const metros = haversineMetros(userLat, userLng, parseFloat(u.latitud.toString()), parseFloat(u.longitud.toString()));
        return { ...u, metros };
      })
      .sort((a, b) => a.metros - b.metros)
      .slice(0, maxResults);

    return res.json({
      success: true,
      data: conDistancia.map(u => ({
        id: u.id,
        nombre: u.nombre,
        tipo: u.tipo,
        tipoLabel: tipoLabel[u.tipo] || u.tipo,
        direccion: `${u.direccionCalle}, ${u.colonia}, ${u.municipio}`,
        direccionCalle: u.direccionCalle,
        colonia: u.colonia,
        municipio: u.municipio,
        latitud: parseFloat(u.latitud.toString()),
        longitud: parseFloat(u.longitud.toString()),
        distancia: formatDistancia(u.metros),
        distanciaMetros: Math.round(u.metros),
        horario: u.horario,
        telefono: u.telefono,
        servicios: u.servicios,
        notas: u.notas,
        mapsUrl: `https://maps.google.com/?q=${u.latitud},${u.longitud}`,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

// POST /api/ubicaciones/buscar — Proxy a Google Maps Places API (search_location)
router.post("/buscar", async (req: Request, res: Response) => {
  const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!MAPS_KEY) {
    return res.status(503).json({ success: false, error: "Google Maps API key no configurada" });
  }

  const { textQuery } = req.body;
  if (!textQuery) {
    return res.status(400).json({ success: false, error: "Campo 'textQuery' requerido" });
  }

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": MAPS_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery,
        locationBias: {
          rectangle: {
            low: { latitude: 20.01, longitude: -100.60 },
            high: { latitude: 21.65, longitude: -99.03 },
          },
        },
        maxResultCount: 3,
      }),
    });

    const data = (await response.json()) as any;
    const places = (data.places || []).map((p: any) => ({
      nombre: p.displayName?.text,
      direccion: p.formattedAddress,
      latitud: p.location?.latitude,
      longitud: p.location?.longitude,
      mapsUrl: `https://maps.google.com/?q=${p.location?.latitude},${p.location?.longitude}`,
    }));

    return res.json({ success: true, data: places });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error al consultar Google Maps" });
  }
});

// GET /api/geocode/reverso?lat=...&lng=... — Reverse geocode proxy
router.get("/reverso", async (req: Request, res: Response) => {
  const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!MAPS_KEY) {
    return res.status(503).json({ success: false, error: "Google Maps API key no configurada" });
  }

  const { lat, lng } = req.query as { lat?: string; lng?: string };
  if (!lat || !lng) {
    return res.status(400).json({ success: false, error: "Parámetros 'lat' y 'lng' requeridos" });
  }

  try {
    const fetch = (await import("node-fetch")).default;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}&language=es`;
    const response = await fetch(url);
    const data = (await response.json()) as any;

    if (!data.results?.length) {
      return res.status(404).json({ success: false, error: "Sin resultados de geocoding" });
    }

    const result = data.results[0];
    const components: Record<string, string> = {};
    for (const comp of result.address_components) {
      for (const type of comp.types) {
        components[type] = comp.long_name;
      }
    }

    return res.json({
      success: true,
      data: {
        direccionCompleta: result.formatted_address,
        calle: components["route"] || null,
        numeroCalle: components["street_number"] || null,
        colonia: components["sublocality_level_1"] || components["neighborhood"] || null,
        ciudad: components["locality"] || null,
        municipio: components["administrative_area_level_2"] || null,
        estado: components["administrative_area_level_1"] || null,
        cp: components["postal_code"] || null,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Error al consultar geocoding" });
  }
});

export default router;
