import { Hero } from '@/components/sections/hero';
import { Story } from '@/components/sections/story';
import { ActivitiesStrip } from '@/components/sections/activities-strip';
import { RoomsTeaser } from '@/components/sections/rooms-teaser';
import { LocationTeaser } from '@/components/sections/location-teaser';
import { Review } from '@/components/sections/review';
import { ReservationCTA } from '@/components/sections/reservation-cta';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Story />
      <ActivitiesStrip />
      <RoomsTeaser />
      <LocationTeaser />
      <Review />
      <ReservationCTA />
    </main>
  );
}
