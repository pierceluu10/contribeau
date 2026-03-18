import { LoginButton } from "@/components/login-button";
import { AppPreview } from "@/components/app-preview";
import { ContributionInfo } from "@/components/contribution-info";
import { ForceDark } from "@/components/force-dark";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden">
      <ForceDark />
      <AppPreview />
      <div className="relative z-10 text-center space-y-3">
        <h1 className="text-5xl font-bold tracking-tight lowercase">
          contribeau
        </h1>
        <p className="text-muted-foreground lowercase">
          your spotify listening, visualized like{" "}
          <ContributionInfo />
        </p>
      </div>
      <div className="relative z-10">
        <LoginButton />
      </div>
    </main>
  );
}
