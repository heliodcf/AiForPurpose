exports.handler = async function (event) {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    const response = await fetch(
      'https://bloodykomododragon-n8n.cloudfy.live/webhook/aria-final',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://bloodykomododragon-n8n.cloudfy.live',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: 'Erro interno. Tente novamente.', isComplete: false }),
    };
  }
};
