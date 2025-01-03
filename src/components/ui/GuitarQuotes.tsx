import { useState, useEffect } from 'react';
import { theme } from '../../styles/theme';

interface Quote {
  author: string;
  text: string;
}

const quotes: Quote[] = [
  { author: "Bruce Springsteen", text: "I got this guitar, and I learned how to make it talk." },
  { author: "Jimi Hendrix", text: "The time I burned my guitar it was like a sacrifice. You sacrifice the things you love. I love my guitar." },
  { author: "Joan Jett", text: "My guitar is not a thing. It is an extension of myself. It is who I am." },
  { author: "Paul McCartney", text: "One of my biggest thrills for me still is sitting down with a guitar or a piano and just out of nowhere trying to make a song happen." },
  { author: "Jimmy Page", text: "I believe every guitar player inherently has something unique about their playing. They just have to identify what makes them different and develop it." },
  { author: "Brian May", text: "The guitar has a kind of grit and excitement possessed by nothing else." },
  { author: "Eddie Van Halen", text: "I'm just a guitarist in a kick-ass rock and roll band. What more could I ask for?" },
  { author: "Stephen King", text: "You couldn't not like someone who liked the guitar." },
  { author: "John Mayer", text: "Playing music to me is as close to having super powers as you can have." },
  { author: "Carlos Santana", text: "There's a melody in everything. And once you find the melody, then you connect immediately with the heart." },
  { author: "Nancy Wilson", text: "Playing guitar is just a whole other dimension. You don't think about anything. It's all about emotion, mood, and being in the moment." },
  { author: "Kirk Hammett", text: "Guitar playing is both extremely easy for me and extremely difficult for me at the same time." },
  { author: "Roger McGuinn", text: "I traded a couple of other guitars for my first Rickenbacker and was smitten from the get-go." },
  { author: "Vince Gill", text: "I've always been a Martin guitar guy; they just have a sound that's so beautiful and pure." },
  { author: "David Gilmour", text: "The Stratocaster has been a major part of my life; it's a versatile instrument that feels like an old friend." },
  { author: "Stevie Ray Vaughan", text: "Number One is my Stratocaster; it's my baby and has been with me through it all." },
  { author: "Chet Atkins", text: "The Gretsch Country Gentleman is a guitar I've always admired for its tone and playability." },
  { author: "Eric Clapton", text: "My Stratocaster is an instrument of great beauty; it's been a significant part of my musical journey." },
  { author: "Keith Richards", text: "I got my first guitar when I was around 14, and I've still got it to this day." },
  { author: "Joe Perry", text: "My first guitar was a Silvertone, and I still have it. It's a great guitar." },
  { author: "Slash", text: "I had no aspirations to be a musician, but I picked up a guitar for two seconds and haven't put it down since." },
  { author: "Noel Gallagher", text: "I always remember my old man saying to me, 'If you have a guitar you'll never be alone'... It's the one thing you can rely on every day." }
];

export const GuitarQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote(prevQuote => {
          const currentIndex = quotes.findIndex(q => q.author === prevQuote.author);
          const nextIndex = (currentIndex + 1) % quotes.length;
          return quotes[nextIndex];
        });
        setIsVisible(true);
      }, 500); // Half of the transition time for smooth fade
    }, 6000); // Changed to 6 seconds for longer display time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-10 max-w-2xl mx-auto mt-8 px-4">
      <div
        className="backdrop-blur-sm bg-white/10 rounded-lg p-6 shadow-lg"
        style={{
          transition: 'opacity 1s ease-in-out',
          opacity: isVisible ? 1 : 0,
          height: '160px', // Fixed height
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <blockquote className="text-center">
          <p className="text-white text-lg font-serif italic mb-2" 
             style={{ 
               textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
               maxWidth: '100%',
               overflow: 'hidden'
             }}>
            "{currentQuote.text}"
          </p>
          <footer className="text-white/80 font-medium" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            — {currentQuote.author}
          </footer>
        </blockquote>
      </div>
    </div>
  );
}; 