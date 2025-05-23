import { useEffect } from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { FaTwitter, FaGithub } from "react-icons/fa";
import Link from "@/components/ui/link";

const ContactPage = () => {
  useEffect(() => {
    document.title = "Contact | Ghost in the Archive";
  }, []);

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Contact", current: true },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white dark:bg-accent border-primary-100 dark:border-accent-700 mb-4">
            <CardHeader>
              <div className="flex flex-col md:flew-row md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-serif text-accent-900 dark:text-white">
                    Contact Us
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-accent-700 dark:text-accent-200 mb-4">
                For inquiries, feedback, or collaboration opportunities, please reach out at one of the following:
              </p>
              <div className="flex-col space-y-2 text-accent-700 dark:text-accent-200">
                <div className="flex space-x-2 items-center">
                  {/* Substack Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-substack" viewBox="0 0 16 16">
                    <path d="M15 3.604H1v1.891h14v-1.89ZM1 7.208V16l7-3.926L15 16V7.208zM15 0H1v1.89h14z"/>
                  </svg>
                  <Link href="https://gogp.substack.com/" className="external-link" target="_blank">
                    Ghost of George Pepperdine
                  </Link>
                </div>
                <div className="flex space-x-2 items-center">
                  <FaTwitter size={20} />
                  <Link href="https://x.com/Mal_Hibou" className="external-link" target="_blank">
                    ghost of george pepperdine
                  </Link>
                </div>
                <div className="flex space-x-2 items-center">
                  <FaGithub size={20} />
                  <Link href="https://github.com/SamuelPerrin" className="external-link" target="_blank">
                    Samuel Perrin
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactPage;