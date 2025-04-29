import { Card, CardContent } from "@/components/ui/card";
import Link from "@/components/ui/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-accent-900">
      <Card className="w-full max-w-md mx-4 bg-white dark:bg-accent border-primary-100 dark:border-accent-700">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            <h1 className="text-2xl font-bold text-accent-900 dark:text-white">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-accent-700 dark:text-accent-200">
            Don't worry! Go <Link to="/" className="text-highlight">home</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
