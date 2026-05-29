import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20)
    .regex(/^[+\d\s-()]+$/, "Only digits, spaces, +, - allowed"),
  email: z.string().trim().email("Invalid email").max(120).optional().or(z.literal("")),
  destination: z.string().trim().min(2).max(80),
  travelDate: z.string().trim().max(40).optional().or(z.literal("")),
  pax: z.string().trim().max(20).optional().or(z.literal("")),
  service: z.string().trim().max(60).optional().or(z.literal("")),
  notes: z.string().trim().max(800).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface InquiryFormProps {
  defaultDestination?: string;
  defaultService?: string;
  variant?: "card" | "inline";
}

const InquiryForm = ({ defaultDestination = "", defaultService = "", variant = "card" }: InquiryFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { destination: defaultDestination, service: defaultService },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to send inquiry');
      }

      toast.success("Inquiry sent! We'll be in touch within 2 hours.");
      reset({ destination: defaultDestination, service: defaultService });
    } catch (error: any) {
      toast.error(`Failed to send inquiry: ${error.message}`);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const wrapClass = variant === "card"
    ? "bg-card text-card-foreground rounded-2xl shadow-elegant p-6 md:p-8 border border-border"
    : "";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={wrapClass}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" {...register("name")} placeholder="Ashwani Tomar" maxLength={80} />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone / WhatsApp *</Label>
          <Input id="phone" type="tel" {...register("phone")} placeholder="+91 98XXXXXXXX" maxLength={20} />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="you@example.com" maxLength={120} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="destination">Destination *</Label>
          <Input id="destination" {...register("destination")} placeholder="Manali, Kashmir, Char Dham…" maxLength={80} />
          {errors.destination && <p className="text-xs text-destructive mt-1">{errors.destination.message}</p>}
        </div>
        <div>
          <Label htmlFor="travelDate">Travel date</Label>
          <Input id="travelDate" type="date" {...register("travelDate")} />
        </div>
        <div>
          <Label htmlFor="pax">Travellers</Label>
          <Input id="pax" {...register("pax")} placeholder="2 adults, 1 child" maxLength={20} />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="notes">Anything we should know?</Label>
          <Textarea id="notes" rows={4} {...register("notes")} placeholder="Hotel preference, budget, special occasions…" maxLength={800} />
        </div>
      </div>
      <Button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full md:w-auto bg-gradient-warm text-primary-foreground shadow-warm hover:opacity-95"
        size="lg"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send Inquiry
      </Button>
      <p className="text-xs text-muted-foreground mt-3">
        Your inquiry will be sent securely. We'll be in touch within 2 hours.
      </p>
    </form>
  );
};

export default InquiryForm;
