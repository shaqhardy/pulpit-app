// Save this as: src/app/api/sermons/route.js

export async function GET() {
  try {
    const response = await fetch('https://xjbw-ute3-kf0i.n7d.xano.io/api:gCildNvr/sermon');
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch sermons' }, { status: 500 });
  }
}
