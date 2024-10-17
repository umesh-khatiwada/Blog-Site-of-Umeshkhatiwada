import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Umesh Khatiwada - DevOps Professional & Cloud Architect`,
    description: "Explore Umesh Khatiwada's expertise in cloud infrastructure, automation, and software development. DevOps Professional & Cloud Architect offering services and insights.",
  }
}

export default function Home() {

  
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between text-white"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
    </div>
  );
}
