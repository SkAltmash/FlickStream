export async function handler(event) {
    const endpoint = event.queryStringParameters.endpoint;
    const apiKey ='d1becbefc947f6d6af137051548adf7f';
  
    const url = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to fetch TMDB data' }),
      };
    }
  }
  