/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'keteyxipukiawzwjhpjn.supabase.co',
            }
        ]
    }
};

export default nextConfig;
