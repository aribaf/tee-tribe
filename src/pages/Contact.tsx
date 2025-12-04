import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Message sent successfully!');
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            GET IN <span className="text-primary">TOUCH</span>
          </h1>
          <p className="font-urdu text-3xl text-secondary">رابطہ کریں</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="border-4 border-muted p-8">
            <h2 className="text-2xl font-bold mb-6 uppercase">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-lg font-bold">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  className="border-2 h-12"
                  placeholder="Your name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-lg font-bold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="border-2 h-12"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-lg font-bold">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  className="border-2 h-12"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-lg font-bold">
                  Message
                </Label>
                <Textarea
                  id="message"
                  required
                  className="border-2 min-h-40"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full text-lg bg-primary hover:bg-primary/90 shadow-neon"
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="border-4 border-muted p-8 hover:border-primary transition-all">
              <Mail className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2 uppercase">Email</h3>
              <p className="text-lg text-muted-foreground">hello@tee-tribe.com</p>
              <p className="text-lg text-muted-foreground">support@tee-tribe.com</p>
            </div>

            <div className="border-4 border-muted p-8 hover:border-primary transition-all">
              <Phone className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold mb-2 uppercase">Phone</h3>
              <p className="text-lg text-muted-foreground">+92 300 1234567</p>
              <p className="text-sm text-muted-foreground mt-2">Mon-Sat, 10AM-6PM PKT</p>
            </div>

            <div className="border-4 border-muted p-8 hover:border-primary transition-all">
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2 uppercase">Location</h3>
              <p className="text-lg text-muted-foreground">
                Lahore, Pakistan
              </p>
              <p className="font-urdu text-lg text-muted-foreground mt-2">
                لاہور، پاکستان
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 border-4 border-primary p-8 bg-primary/5">
          <h2 className="text-3xl font-bold mb-6 uppercase">Quick Answers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-lg mb-2">Shipping Time?</h4>
              <p className="text-muted-foreground">3-5 business days within Pakistan</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Returns?</h4>
              <p className="text-muted-foreground">7-day return policy on all items</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Custom Orders?</h4>
              <p className="text-muted-foreground">Bulk orders available, contact us</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Design Approval?</h4>
              <p className="text-muted-foreground">2-3 days review process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
