"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import ReactCanvasConfetti from "react-canvas-confetti";

const canvasStyles = {
  position: "fixed" as const,
  pointerEvents: "none" as const,
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  zIndex: 1000,
};

let animationInstance: any = null;

const currencies = [
  { code: "CAD", name: "Canadian Dollar" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
];

const Wizard = ({ userName }: { userName: string }) => {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const updateUserMutation = useMutation(api.users.updateUser);
  const { user } = useUser();

  const handleSubmit = () => {
    updateUserMutation({
      clerkId: user?.id ?? "",
      name: user?.fullName ?? "",
      email: user?.emailAddresses[0].emailAddress ?? "",
      profilePictureUrl: user?.imageUrl ?? "",
      currency: selectedCurrency,
    });
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const makeShot = (particleRatio: number, opts: any) => {
    animationInstance &&
      animationInstance({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  };

  const fire = () => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const getInstance = (instance: any) => {
    if (instance) {
      animationInstance = instance.confetti;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardTitle className="text-2xl font-bold">{userName}! 👋</CardTitle>
          </div>
          <CardDescription>Welcome to your account setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Choose your currency</h3>
              <p className="text-sm text-gray-500">
                You can change this later in settings.
              </p>
            </div>
            <Select onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select a currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              fire();
              handleSubmit();
            }}
            disabled={!selectedCurrency}
          >
            Set Currency
          </Button>
        </CardFooter>
      </Card>
      <ReactCanvasConfetti onInit={getInstance} style={canvasStyles} />
    </div>
  );
};

export default Wizard;
