// Replace the sample media with Umanga's original photographs here.
// Use local paths under assets/. Portrait remains an honest empty photo slot until supplied.
export const portfolio = {
  portrait: null,
  portraitAlt: 'Umanga Rimal, photographer and filmmaker from Nepal',
  knowbit: { description: 'A personal AI project by Umanga Rimal.', url: null },
  photos: [
    { title: 'After the sun', category: 'street', categoryLabel: 'Street', src: 'assets/durbar-dusk.webp', alt: 'Sample image of a Nepalese square under a blue dusk sky', note: 'Dusk / sample image' },
    { title: 'The quiet hours', category: 'light', categoryLabel: 'Light study', src: 'assets/window-study.webp', alt: 'Sample image of an empty chair in warm window light', note: 'Window light / sample image' },
    { title: 'Between shadows', category: 'light', categoryLabel: 'Light study', src: 'assets/temple-light.webp', alt: 'Sample image of sunlight across an old courtyard', note: 'Courtyard / sample image' },
    { title: 'An evening together', category: 'events', categoryLabel: 'Events', src: 'assets/mandap.webp', alt: 'Sample image of an illuminated ceremonial canopy', note: 'Celebration / sample image' }
  ]
};

// Add original photographs as {src,title,alt,note} when supplied.
// A second lens entry requires its model and mount alignment before activation.
export const lensSets = [
  { id: 'kit-18-55', name: 'EF-S 18–55mm', model: null, photos: [] }
];
