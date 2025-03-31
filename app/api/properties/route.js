export const GET = () => {
    return new Response(JSON.stringify({message: 'Hello World'}),
    {status:200},
)
};