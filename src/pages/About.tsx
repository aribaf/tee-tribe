import { Zap, Users, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            ABOUT <span className="text-primary">TEE-TRIBE</span>
          </h1>
          <p className="font-urdu text-3xl text-secondary">ہمارے بارے میں</p>
        </div>

        {/* Mission */}
        <div className="border-4 border-primary p-8 mb-12 bg-primary/5">
          <h2 className="text-3xl font-bold mb-6 uppercase">Our Mission</h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-4">
            Tee-Tribe is more than just a t-shirt brand. We're a movement that celebrates bold self-expression,
            fearless creativity, and authentic identity.
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Founded in Pakistan, we bring together cutting-edge design with premium quality to create
            wearable art that speaks volumes.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="border-4 border-muted p-8 hover:border-primary transition-all">
            <Zap className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3 uppercase">Bold</h3>
            <p className="text-muted-foreground">
              We don't do subtle. Every design makes a statement.
            </p>
          </div>

          <div className="border-4 border-muted p-8 hover:border-primary transition-all">
            <Users className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-2xl font-bold mb-3 uppercase">Community</h3>
            <p className="text-muted-foreground">
              Built by creators, for creators. Join the tribe.
            </p>
          </div>

          <div className="border-4 border-muted p-8 hover:border-primary transition-all">
            <Heart className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3 uppercase">Quality</h3>
            <p className="text-muted-foreground">
              Premium materials, ethical production, lasting impact.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="border-4 border-muted p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 uppercase">Our Story</h2>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p>
              It started with a simple idea: clothing should be a canvas for self-expression,
              not just fabric on your back.
            </p>
            <p>
              In a world of mass-produced mediocrity, we saw an opportunity to create something different.
              Something bold. Something that actually means something.
            </p>
            <p>
              Today, Tee-Tribe empowers thousands of artists and designers to share their vision with the world,
              while giving customers access to truly unique, conversation-starting designs.
            </p>
            <p className="font-bold text-foreground">
              This is more than fashion. This is identity. This is tribe.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center border-4 border-secondary p-12 bg-secondary/5">
          <h2 className="text-3xl font-bold mb-4 uppercase">Join the Movement</h2>
          <p className="text-xl text-muted-foreground mb-6">
            Whether you're a designer with a vision or someone who refuses to blend in,
            there's a place for you in the Tee-Tribe.
          </p>
          <p className="text-2xl font-bold text-secondary font-urdu">
            قبیلے میں شامل ہوں
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
