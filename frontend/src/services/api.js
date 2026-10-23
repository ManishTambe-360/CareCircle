const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function predictAnomaly(activity) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });

  if (!response.ok) {
    throw new Error("Prediction request failed");
  }

  return response.json();
}

export async function getDemoNormal() {
  const response = await fetch(`${API_BASE_URL}/demo/normal`);

  if (!response.ok) {
    throw new Error("Normal demo failed");
  }

  return response.json();
}

export async function getDemoAnomaly() {
  const response = await fetch(`${API_BASE_URL}/demo/anomaly`);

  if (!response.ok) {
    throw new Error("Anomaly demo failed");
  }

  return response.json();
}


export async function getActivityHistory() {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/history`
  );

  if (!response.ok) {
    throw new Error("Failed to load activity history");
  }

  return response.json();
}

export async function getIncidents() {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/incidents`
  );

  if (!response.ok) {
    throw new Error("Failed to load incidents");
  }

  return response.json();
}


export async function analyzeAndSave(residentId, activity) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/analyze/${encodeURIComponent(residentId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activity),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Activity analysis failed");
  }

  return response.json();
}
