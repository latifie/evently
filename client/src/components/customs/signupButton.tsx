import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { axiosConfig } from "@/config/axiosConfig";

interface SignupButtonProps {
  eventId: string;
  capacityLeft: number | null | undefined;
}

export const SignupButton = ({ eventId, capacityLeft }: SignupButtonProps) => {
  const [isSignedUp, setIsSignedUp] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState<number | null>(capacityLeft ?? null);

  useEffect(() => {
    const checkSignup = async () => {
      try {
        const res = await axiosConfig.get(`/signups/${eventId}`);
        setIsSignedUp(res.status === 200);
      } catch (err: any) {
        if (err.response?.status === 204) {
          setIsSignedUp(false);
        } else {
          console.error("Erreur lors de la vérification d'inscription :", err);
        }
      }
    };

    setAvailable(capacityLeft ?? null); // Init local state
    checkSignup();
  }, [eventId, capacityLeft]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      await axiosConfig.post(`/signups/${eventId}`);
      setIsSignedUp(true);
      toast.success("Inscription réussie !");
      setAvailable((prev: number | null) => (prev != null ? prev - 1 : prev));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur lors de l’inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      setLoading(true);
      await axiosConfig.delete(`/signups/${eventId}`);
      setIsSignedUp(false);
      toast.success("Désinscription réussie !");
      setAvailable((prev: number | null) => (prev != null ? prev + 1 : prev));
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Erreur lors de la désinscription");
    } finally {
      setLoading(false);
    }
  };

  if (isSignedUp === null) {
    return <div>...</div>; // Loader ou placeholder
  }

  if (isSignedUp) {
    return (
      <Button variant="outline" onClick={handleUnsubscribe} disabled={loading} className="text-red-600 border-red-600 hover:bg-red-50">
        Se désinscrire
      </Button>
    );
  }

  if (available !== null && available <= 0) {
    return <Badge variant="destructive">Full</Badge>;
  }

  return (
    <Button onClick={handleSubscribe} disabled={loading}>
      S’inscrire
    </Button>
  );
};
