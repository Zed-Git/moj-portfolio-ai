import slikaRadiologija from '../assets/medical-logo.jpg'; 
import videoDemo from '../assets/moj-video.mp4'; 
import slikaBioStatAnalitičar from '../assets/project4.jpg';
import slikaTelemedicinaApp from '../assets/project3.jpg'; 
import videoDemo2 from '../assets/moj-video2.mp4';
import videoDemo3 from '../assets/moj-video4.mp4';

export const mojiProjekti = [
  { id: 1, naslov: "AI Radiologija", opis: "Sistem za ranu detekciju anomalija na rendgenskim snimcima.", detaljanTekst: "Dugačak tekst o neuronskim mrežama u radiologiji...", tipMedija: "slika", izvorMedija: slikaRadiologija, tehnologija: "Python, PyTorch" },
  { id: 2, naslov: "AI Analiza EKG-a", opis: "Video demonstracija prepoznavanja aritmija u realnom vremenu.", detaljanTekst: "Detaljna analiza ritma srca korišćenjem AI...", tipMedija: "video", izvorMedija: videoDemo, tehnologija: "TensorFlow" },
  { id: 3, naslov: "Bio-Stat Analitičar", opis: "Alat za statističku obradu kliničkih istraživanja.", detaljanTekst: "Statistički modeli za medicinske baze podataka...", tipMedija: "slika", izvorMedija: slikaBioStatAnalitičar, tehnologija: "R, Shiny" },
  { id: 4, naslov: "Telemedicina App", opis: "Platforma za video konsultacije.", detaljanTekst: "Sistem za povezivanje pacijenata i lekara...", tipMedija: "slika", izvorMedija: slikaTelemedicinaApp, tehnologija: "React Native" },
  { id: 5, naslov: "Farmako-Bot", opis: "Pametni sistem za interakciju lekova.", detaljanTekst: "NLP model za analizu kontraindikacija...", tipMedija: "video", izvorMedija: videoDemo2, tehnologija: "OpenAI API" },
  { id: 6, naslov: "Genomika AI", opis: "Analiza genetskih podataka.", detaljanTekst: "Identifikacija predispozicija za bolesti...", tipMedija: "video", izvorMedija: videoDemo3, tehnologija: "Python, Big Data" }
];