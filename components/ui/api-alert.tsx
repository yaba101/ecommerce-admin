import { Copy, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";
import { useToast } from "./use-toast";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  admin: "Admin",
  public: "Public",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  admin: "destructive",
  public: "secondary",
};

const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {
  const { toast } = useToast();
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast({
      title: "Copied",
      variant: "default",
    });
  };
  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
