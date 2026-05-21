import { Hero } from '@/components/sections/hero';
import { Story } from '@/components/sections/story';
import { ReviewsStrip } from '@/components/sections/reviews-strip';
import { RoomsTeaser } from '@/components/sections/rooms-teaser';
import { LocationTeaser } from '@/components/sections/location-teaser';
import { Review } from '@/components/sections/review';
import { FAQ } from '@/components/sections/faq';
import { ReservationCTA } from '@/components/sections/reservation-cta';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Story />
      <ReviewsStrip />
      <RoomsTeaser />
      <LocationTeaser />
      <Review />
      <FAQ />
      <ReservationCTA />
    </main>
  );
}
