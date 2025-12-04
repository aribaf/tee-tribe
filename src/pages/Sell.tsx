import { useState } from 'react';
import { Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Sell = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success('Design submitted successfully!');
    setIsSubmitting(false);
    setPreview(null);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            SELL YOUR <span className="text-primary">DESIGN</span>
          </h1>
          <p className="font-urdu text-2xl text-secondary mb-4">اپنا ڈیزائن فروخت کریں</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your artwork and turn creativity into cash. We handle printing, shipping, and payments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Design Upload */}
          <div className="border-4 border-muted p-8">
            <h2 className="text-2xl font-bold mb-6 uppercase">Upload Design</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="design-file" className="text-lg font-bold mb-2 block">
                  Design File
                </Label>
                <div className="border-4 border-dashed border-muted p-8 text-center hover:border-primary transition-all cursor-pointer">
                  <input
                    id="design-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  <label htmlFor="design-file" className="cursor-pointer">
                    {preview ? (
                      <div className="space-y-4">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-64 mx-auto object-contain"
                        />
                        <p className="text-sm text-primary font-bold">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-lg font-bold">Drop your design here</p>
                          <p className="text-sm text-muted-foreground">or click to browse</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, or SVG (Max 10MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Design Details */}
          <div className="border-4 border-muted p-8">
            <h2 className="text-2xl font-bold mb-6 uppercase">Design Details</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="design-name" className="text-lg font-bold">
                  Design Name
                </Label>
                <Input
                  id="design-name"
                  type="text"
                  required
                  className="border-2 h-12"
                  placeholder="Give your design a catchy name"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-lg font-bold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  required
                  className="border-2 min-h-32"
                  placeholder="Tell us about your design inspiration..."
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-lg font-bold">
                  Your Asking Price (Rs.)
                </Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min="1000"
                  className="border-2 h-12"
                  placeholder="2500"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  You'll earn 30% commission on each sale
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="flex-1 text-lg bg-primary hover:bg-primary/90 shadow-neon"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT DESIGN'}
            </Button>
          </div>
        </form>

        {/* Guidelines */}
        <div className="mt-12 border-4 border-primary p-8 bg-primary/5">
          <h3 className="text-2xl font-bold mb-4 uppercase">Design Guidelines</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ High-resolution images (at least 300 DPI)</li>
            <li>✓ Original artwork only - no copyrighted material</li>
            <li>✓ Designs should work well on black t-shirts</li>
            <li>✓ Bold, high-contrast designs work best</li>
            <li>✓ We reserve the right to reject inappropriate content</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sell;
