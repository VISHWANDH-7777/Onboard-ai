import axios from 'axios';

export async function analyzeWithPython(payload) {
  const baseUrl = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const analyzeUrl = `${normalizedBase}/analyze`;

  try {
    const response = await axios.post(analyzeUrl, payload, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    const responseBody = error.response?.data;
    const detail = typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody || {});
    throw new Error(`Python analyze call failed at ${analyzeUrl} with status ${status || 'unknown'}: ${detail}`);
  }
}
