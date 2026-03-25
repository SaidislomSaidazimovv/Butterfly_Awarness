import { useState, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";

const quoteText = "Sometimes the bravest thing you can do is make a simple gesture. The Butterfly is that gesture — a beacon of hope in the darkest moments.";
const quoteWords = quoteText.split(" ");

const QuoteWord = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
  const color = useTransform(progress, range, ["#333336", "#ffffff"]);
  return (
    <motion.span style={{ color }}>
      {children}{" "}
    </motion.span>
  );
};
import blogo from "./blogo.svg";
import heroVideo from "./0324(1).webm";
import aboutImage from "./Two_people_performing_202603250427.jpeg";
import wearItIcon from "./Wear it.png";
import showItIcon from "./Show it.png";
import reachOutIcon from "./Reach out.png";
import guideVideo from "./66d8c88b804f724a4b4821448f14f903_1774279874_8s1cv4an (1) (1) (1).webm";
import recognizeImage from "./Recognize the Sign.jpeg";
import approachImage from "./Approach and Connect.jpeg";
import questionsImage from "./Two_people_talking_202603250837.jpeg";
import callImage from "./Two_people_sitting_202603250840.jpeg";
import goalIcon from "./goal.svg";
import heartIcon from "./heart.svg";
import globeIcon from "./globe.svg";
import butterIcon from "./butter_1.png";
import createContentImg from "./Create Content.png";
import useHashtagImg from "./Use the Hashtag.png";
import challengeImg from "./Challenge Your Followers.png";
import linkPageImg from "./Link This Page.png";
import blogoSvg from "./blogo.svg";
import {
  HandMetal,
  PhoneCall,
  Clock,
  Share2,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertCircle,
  Play
} from "lucide-react";

export default function App() {

  const aboutRef = useRef<HTMLElement>(null);
  const guideVideoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const spreadSliderRef = useRef<HTMLDivElement>(null);

  const scrollSpreadSlider = (direction: 'left' | 'right') => {
    if (spreadSliderRef.current) {
      const { scrollLeft, clientWidth } = spreadSliderRef.current;
      const scrollAmount = clientWidth * 0.75;
      spreadSliderRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ["start 70%", "end 60%"]
  });

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.45;
      sliderRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handlePlayFullscreen = () => {
    if (guideVideoRef.current) {
      const video = guideVideoRef.current as any;
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      }
    }
  };

  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start start", "end end"]
  });
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1000, 1]);
  const bgImageOpacity = useTransform(scrollYProgress, [0.2, 0.9], [1, 0]);
  const maskOpacity = useTransform(scrollYProgress, [0.55, 0.9], [1, 0]);

  const [isUnmasked, setIsUnmasked] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.4 && !isUnmasked) {
      setIsUnmasked(true);
    } else if (latest < 0.4 && isUnmasked) {
      setIsUnmasked(false);
    }
  });

  const steps = [
    {
      title: "Recognize the Sign",
      duration: "0-5s",
      description: "A colleague raises crossed hands, palms open like wings, shaking their fingers. This is the Butterfly.",
      icon: HandMetal,
      image: recognizeImage,
      questions: null,
    },
    {
      title: "Approach and Connect",
      duration: "5-15s",
      description: "Move to them immediately. Create a safe, private space if possible, or just be present.",
      icon: Users,
      image: approachImage,
      questions: null,
    },
    {
      title: "The 3 Critical Questions",
      duration: "15-25s",
      description: "Ask directly and calmly. Do not hesitate.",
      icon: AlertCircle,
      image: questionsImage,
      questions: [
        "Are you thinking about hurting yourself?",
        "Do you have a plan to end your life?",
        "Can we get you help right now together?"
      ]
    },
    {
      title: "Call 988",
      duration: "25-30s",
      description: "Dial the National Mental Health Hotline immediately and stay with them.",
      icon: PhoneCall,
      image: callImage,
      questions: null,
    }
  ];

  return (
    <div className="bg-[#000000] text-[#f5f5f7] font-sans antialiased min-h-screen z-0 relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/80 backdrop-blur-md border-b border-[#1d1d1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={blogo} alt="Butterfly Logo" className="h-6 w-auto" />
            <span className="font-semibold tracking-tight text-white text-sm">Butterfly Project</span>
          </div>
          <div className="flex items-center space-x-8">
            <a href="#about" className="text-xs text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors">About</a>
            <a href="#the-sign" className="text-xs text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors">The Sign</a>
            <a href="#30-seconds" className="text-xs text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors">The Protocol</a>
            <a href="#influencers" className="text-xs text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors">Creators</a>
            <a
              href="tel:988"
              className="text-xs px-3 py-1 bg-white text-black rounded-full font-medium tracking-tight hover:bg-[#e8e8ed] transition-colors"
            >
              Call 988
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-end px-4 sm:px-12 pb-16 pt-16 bg-black">
        {/* Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden flex justify-center items-center">
          <video
            src={heroVideo}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        {/* Content Container spanning the bottom */}
        <div className="relative z-10 max-w-[1400px] mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-0">
          {/* Bottom Left: Title & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl text-left"
          >
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-white mb-2">Butterfly Project</h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 text-white">
              A gesture that <br className="hidden sm:block" />
              saves lives.
            </h1>
            <p className="text-xl md:text-3xl text-[#a1a1a6] font-medium tracking-tight">
              Learn it, recognize it, and know how to respond.
            </p>
          </motion.div>

          {/* Bottom Right: Pill UI */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex-shrink-0 mb-2 md:mb-6"
          >
            <div className="flex items-center gap-6 bg-[#1d1d1f]/80 backdrop-blur-md rounded-full pl-6 pr-2 py-2 border border-[#333336]">
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-white">Save a life today</span>
                <span className="text-xs text-[#a1a1a6]">Takes only 30 seconds.*</span>
              </div>
              <a
                href="#the-sign"
                className="px-6 py-2.5 bg-[#5cedc5] text-black rounded-full text-sm font-semibold tracking-wide hover:bg-[#4bc7a6] transition-colors"
              >
                Learn
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About / The Crisis Section */}
      <section id="about" ref={aboutRef} className="h-[500vh] md:h-[200vh] bg-[#000000] relative">
        <div className="sticky top-0 h-screen w-full overflow-y-auto md:overflow-hidden">
          {/* Base Image */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-black">
            <motion.img style={{ opacity: bgImageOpacity }} src={aboutImage} className="w-full h-full object-cover" />
          </div>

          {/* Multiply Mask Layer — white text inside so multiply blend punches through */}
          <motion.div
            className="absolute inset-0 w-full h-full bg-black z-10 pointer-events-none"
            style={{ mixBlendMode: 'multiply', opacity: maskOpacity }}
          >
            <motion.div
              style={{ scale: textScale, transformOrigin: 'center' }}
              className="absolute top-[25vh] left-0 w-full flex justify-center"
            >
              <h2 className="font-bold tracking-tighter whitespace-nowrap text-white" style={{
                fontSize: "3rem",
                lineHeight: 1,
              }}>
                The Silent Struggle
              </h2>
            </motion.div>
          </motion.div>

          {/* Gradient text layer — appears above mask once unmasked */}
          <motion.div
            className="absolute top-[25vh] left-0 w-full flex justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isUnmasked ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="font-bold tracking-tighter whitespace-nowrap" style={{
              fontSize: "3rem",
              lineHeight: 1,
              backgroundImage: "linear-gradient(90deg,rgba(225, 245, 240, 1) 0%, rgba(93, 238, 198, 1) 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent"
            }}>
              The Silent Struggle
            </h2>
          </motion.div>

          {/* Solid Layer (Subtext and Cards below masking text) */}
          <div className="absolute inset-0 w-full h-full z-20 pointer-events-none">
            <div className="absolute top-[10vh] md:top-[25vh] left-0 w-full flex flex-col items-center pb-16 md:pb-0">
              {/* Invisible Spacer replacing the removed text layer so layout is maintained */}
              <div className="invisible pointer-events-none">
                <h2 className="text-white font-bold tracking-tighter whitespace-nowrap" style={{ fontSize: "3rem", lineHeight: 1 }}>
                  The Silent Struggle
                </h2>
              </div>

              {/* Subtext */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: isUnmasked ? 1 : 0, y: isUnmasked ? 0 : 40 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mt-8 px-4 w-full max-w-[1200px] text-center pointer-events-auto"
              >
                <p className="text-xl md:text-3xl text-[#a1a1a6] leading-relaxed font-light drop-shadow-lg mx-auto max-w-4xl">
                  Corporate fatigue, burnout, and mental health crises are leading causes of tragedy. Many hesitate to speak. They need a non-verbal, unambiguous way to ask for immediate intervention. That is why we are launching the Butterfly.
                </p>
              </motion.div>

              {/* Cards */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: isUnmasked ? 1 : 0, y: isUnmasked ? 0 : 40 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="mt-12 w-full max-w-[1200px] px-4 pointer-events-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
                  {[
                    {
                      title: "Silent Cry",
                      desc: "When words are too heavy, gestures bridge the gap without awkwardness.",
                      icon: ShieldAlert,
                      bg: "#1A201E",
                      gradient: "linear-gradient(212deg,rgba(26, 32, 30, 1) 0%, rgba(32, 212, 161, 1) 50%, rgba(93, 238, 198, 1) 100%)"
                    },
                    {
                      title: "Universal",
                      desc: "Understood across languages and workspaces globally.",
                      icon: Clock,
                      bg: "#0f263d",
                      gradient: "linear-gradient(212deg,rgba(15, 38, 61, 1) 0%, rgba(49, 103, 253, 1) 50%, rgba(109, 205, 255, 1) 100%)"
                    },
                    {
                      title: "Actionable",
                      desc: "Triggers a clear, 30-second rapid response framework.",
                      icon: CheckCircle2,
                      bg: "#1e0b2e",
                      gradient: "linear-gradient(212deg,rgba(30, 11, 46, 1) 0%, rgba(153, 67, 213, 1) 50%, rgba(224, 112, 255, 1) 100%)"
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1c1c1e]/90 backdrop-blur-xl p-8 rounded-3xl border border-[#2c2c2e]/50 flex flex-col h-full shadow-2xl"
                    >
                      <div
                        className="h-12 w-12 rounded-2xl flex items-center justify-center mb-6 text-white shadow-inner"
                        style={{ backgroundColor: item.bg, backgroundImage: item.gradient }}
                      >
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold tracking-tight text-white mb-3">{item.title}</h3>
                      <p className="text-base text-[#a1a1a6] leading-relaxed flex-grow font-normal">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Make the Sign Section */}
      <section id="the-sign" className="py-24 px-4 bg-[#0c0c0c] border-y border-[#1d1d1f]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#1c1c1e] h-[400px] rounded-3xl border border-[#2c2c2e] overflow-hidden relative flex flex-col items-center justify-end group cursor-pointer"
            onClick={handlePlayFullscreen}
          >
            <video
              ref={guideVideoRef}
              src={guideVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity duration-300"
            />
            {/* Inner Gradient for bottom text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300 shadow-2xl">
                <Play className="h-6 w-6 text-white fill-white ml-1" />
              </div>
            </div>

            <div className="relative z-10 w-full text-center pb-6 pointer-events-none">
              <p className="text-sm text-white font-medium tracking-wide">See the gesture in action</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-semibold tracking-wider text-[#5cedc5] uppercase mb-2 block">Visual Guide</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">One gesture. A shared human language.</h2>

            <ul className="space-y-8">
              <li className="flex items-start">
                <div className="w-12 h-12 mr-5 flex-shrink-0 rounded-xl bg-[#1c1c1e]/50 border border-[#2c2c2e] p-2 flex items-center justify-center">
                  <img src={wearItIcon} alt="Wear It" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold tracking-tight text-white mb-1">Wear it.</h4>
                  <p className="text-sm text-[#a1a1a6] leading-relaxed font-light">Identification as an ally. A silent invitation that says, "I’m safe to talk to."</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-12 h-12 mr-5 flex-shrink-0 rounded-xl bg-[#1c1c1e]/50 border border-[#2c2c2e] p-2 flex items-center justify-center">
                  <img src={showItIcon} alt="Show It" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold tracking-tight text-white mb-1">Show it.</h4>
                  <p className="text-sm text-[#a1a1a6] leading-relaxed font-light">The 30-second signal for help. It means "I see you" and triggers the rapid-response protocol.</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-12 h-12 mr-5 flex-shrink-0 rounded-xl bg-[#1c1c1e]/50 border border-[#2c2c2e] p-2 flex items-center justify-center">
                  <img src={reachOutIcon} alt="Reach Out" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold tracking-tight text-white mb-1">Reach out.</h4>
                  <p className="text-sm text-[#a1a1a6] leading-relaxed font-light">The immediate response. A standardized script that ensures no one walks alone.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* The 30 Second Protocol */}
      <section id="30-seconds" className="py-24 bg-[#000000] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:max-w-3xl"
          >
            <span className="text-xs font-semibold tracking-wider text-[#5cedc5] uppercase mb-2 block">Action Framework</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">The 30-Second Intervention</h2>
            <p className="text-lg md:text-xl text-[#a1a1a6] leading-relaxed font-light">
              Time is everything. When you see the sign, drop what you are doing and take action. It takes exactly 30 seconds to run this life-saving protocol.
            </p>
          </motion.div>
        </div>

        {/* Slider */}
        <div className="relative w-full">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 list-none"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>

            {/* Left Spacer */}
            <div
              className="flex-shrink-0 snap-start"
              style={{ width: 'max(1rem, calc(50vw - 700px + 1rem))' }}
            />

            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`w-[85vw] sm:w-[400px] md:w-[450px] lg:w-[480px] xl:w-[540px] flex-shrink-0 snap-start flex flex-col ${idx !== steps.length - 1 ? 'mr-6' : ''}`}
              >
                {/* Image Card */}
                <div className="bg-[#1c1c1e] rounded-3xl aspect-[16/10] w-full overflow-hidden mb-6 relative shadow-2xl">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center shadow-lg border border-white/10">
                    <Clock className="w-3.5 h-3.5 text-white mr-1.5" />
                    <span className="text-xs font-semibold text-white tracking-wide">{step.duration}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="px-1 text-left flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                    <span className="text-white">{step.title}.</span> <span className="text-[#a1a1a6] font-normal">{step.description}</span>
                  </h3>

                  {step.questions && (
                    <div className="mt-4 space-y-2">
                      {step.questions.map((q, qIdx) => (
                        <div key={qIdx} className="flex items-start">
                          <span className="text-[#5cedc5] mr-2 mt-0.5">•</span>
                          <span className="text-sm text-[#86868b] leading-relaxed">{q}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {idx === 3 && (
                    <div className="mt-6">
                      <a
                        href="tel:988"
                        className="px-6 py-2.5 bg-[#5cedc5] text-black rounded-full text-sm font-semibold tracking-wide hover:bg-[#4bc7a6] transition-colors inline-flex items-center shadow-lg"
                      >
                        <PhoneCall className="mr-2 h-4 w-4" />
                        Call 988 Now
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Right Spacer */}
            <div
              className="flex-shrink-0"
              style={{ width: 'max(1rem, calc(50vw - 700px + 1rem))' }}
            />
          </div>
        </div>

        {/* Section Footer: Badge and Navigation */}
        <div className="max-w-[1400px] mx-auto px-4 mt-6 flex justify-between items-center">
          <div
            className="inline-flex items-center px-4 md:px-5 py-2 rounded-full backdrop-blur-md shadow-2xl"
            style={{ background: 'linear-gradient(90deg, rgba(32,212,161,0.15) 0%, rgba(49,103,253,0.15) 50%, rgba(153,67,213,0.15) 100%)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <span className="text-xs md:text-sm font-medium tracking-tight text-white">
              <span className="mr-2">🕐</span>
              Total time: 30 seconds.
              <span className="text-white/70 ml-1">Potential impact: A life saved.</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => scrollSlider('left')}
              className="w-10 h-10 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] flex items-center justify-center transition-colors group z-10 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-[#a1a1a6] group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
            </button>
            <button
              onClick={() => scrollSlider('right')}
              className="w-10 h-10 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] border border-[#2c2c2e] flex items-center justify-center transition-colors group z-10 shadow-lg"
            >
              <ChevronRight className="w-5 h-5 text-[#a1a1a6] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </section>

      {/* Scroll Reveal Quote Section */}
      <section ref={quoteRef} className="h-[200vh] bg-[#000000] relative border-t border-[#2c2c2e]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mb-8 md:mb-12"
          >
            <img src={butterIcon} alt="Butterfly Icon" className="w-16 h-16 md:w-20 md:h-20 opacity-90" />
          </motion.div>
          <p className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-center max-w-5xl leading-[1.1]">
            {quoteWords.map((word, i) => {
              const start = i / quoteWords.length;
              const end = start + (1 / quoteWords.length);
              return (
                <QuoteWord key={i} progress={quoteProgress} range={[start, end]}>
                  {word}
                </QuoteWord>
              );
            })}
          </p>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-24 px-4 bg-[#141414]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-20 text-center max-w-3xl mx-auto"
          >
            <span className="text-xs font-semibold tracking-wider text-[#5cedc5] uppercase mb-3 block">Why it matters</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">
              Mental health crises are more common than you think.
            </h2>
            <p className="text-lg md:text-xl text-[#a1a1a6] leading-relaxed font-light">
              The Butterfly gesture breaks the silence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
            {/* Column 1 */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Tall Image Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-[2rem] relative overflow-hidden h-[400px] md:h-[500px] flex flex-col justify-end p-8 md:p-10 bg-[#1c1c1e] shadow-2xl"
              >
                <img src={aboutImage} alt="Mental Health" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 pointer-events-none" />
                <div className="relative z-10 mt-auto">
                  <div
                    className="text-6xl md:text-8xl font-bold mb-4 tracking-tighter"
                    style={{
                      backgroundImage: "linear-gradient(212deg,rgba(26, 32, 30, 1) 0%, rgba(32, 212, 161, 1) 50%, rgba(93, 238, 198, 1) 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent"
                    }}
                  >
                    49%
                  </div>
                  <p className="text-[#f5f5f7] md:text-lg font-medium leading-snug">
                    Of workers feel their job negatively affects their mental health.
                  </p>
                </div>
              </motion.div>

              {/* Short Background Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="bg-[#1c1c1e] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row md:items-center h-auto md:h-[250px] shadow-2xl"
              >
                <div
                  className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-0 mr-0 md:mr-8 flex-shrink-0"
                  style={{
                    backgroundImage: "linear-gradient(212deg,rgba(15, 38, 61, 1) 0%, rgba(49, 103, 253, 1) 50%, rgba(109, 205, 255, 1) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent"
                  }}
                >
                  76%
                </div>
                <p className="text-[#f5f5f7] md:text-lg font-medium leading-snug">
                  Hesitate to ask for help due to stigma in the workplace.
                </p>
              </motion.div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Short Background Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-[#1c1c1e] rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row md:items-center h-auto md:h-[250px] shadow-2xl"
              >
                <div
                  className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 md:mb-0 mr-0 md:mr-8 flex-shrink-0"
                  style={{
                    backgroundImage: "linear-gradient(212deg,rgba(30, 11, 46, 1) 0%, rgba(153, 67, 213, 1) 50%, rgba(224, 112, 255, 1) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent"
                  }}
                >
                  132M
                </div>
                <p className="text-[#f5f5f7] md:text-lg font-medium leading-snug">
                  Days of work lost annually due to mental health issues.
                </p>
              </motion.div>

              {/* Tall Image Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="rounded-[2rem] relative overflow-hidden h-[400px] md:h-[500px] flex flex-col justify-end p-8 md:p-10 bg-[#1c1c1e] shadow-2xl"
              >
                <img src={questionsImage} alt="Warning Signs" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 pointer-events-none" />
                <div className="relative z-10 mt-auto">
                  <div
                    className="text-6xl md:text-8xl font-bold mb-4 tracking-tighter"
                    style={{
                      backgroundImage: "linear-gradient(212deg,rgba(46, 18, 11, 1) 0%, rgba(213, 90, 67, 1) 50%, rgba(255, 140, 112, 1) 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent"
                    }}
                  >
                    90%
                  </div>
                  <p className="text-[#f5f5f7] md:text-lg font-medium leading-snug">
                    Of people who die by suicide showed warning signs beforehand.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Section Footer: Badge */}
          <div className="max-w-5xl mx-auto mt-12 flex justify-center">
            <div
              className="inline-flex items-center px-4 md:px-5 py-2 rounded-full backdrop-blur-md shadow-2xl"
              style={{ background: 'linear-gradient(90deg, rgba(32,212,161,0.15) 0%, rgba(49,103,253,0.15) 50%, rgba(153,67,213,0.15) 100%)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <span className="text-xs md:text-sm font-medium tracking-tight text-white">
                <span className="mr-2">🕐</span>
                Total time: 30 seconds.
                <span className="text-white/70 ml-1">Potential impact: A life saved.</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* For Content Creators Section */}
      <section className="py-24 px-4 bg-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold tracking-wider text-[#86868b] uppercase mb-3 block">For Content Creators</span>
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-4">Help us spread the word.</h2>
              <p className="text-lg md:text-xl text-[#86868b] font-medium leading-relaxed">
                Your voice can reach millions. Join influencers like MrBeast and IShowSpeed in making the Butterfly gesture known worldwide.
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-8 md:p-10 rounded-3xl flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 mb-6">
                <img src={goalIcon} alt="Quick to Learn" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Quick to Learn</h3>
              <p className="text-[#86868b] font-medium leading-relaxed">
                <span className="text-[#1d1d1f]">30 seconds to understand, 1 minute to explain.</span> Perfect for quick content that saves lives.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 md:p-10 rounded-3xl flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 mb-6">
                <img src={heartIcon} alt="Meaningful Impact" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Meaningful Impact</h3>
              <p className="text-[#86868b] font-medium leading-relaxed">
                Use your platform for good. <span className="text-[#1d1d1f]">Every share could prevent a tragedy and save a life.</span>
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 md:p-10 rounded-3xl flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="w-10 h-10 md:w-12 md:h-12 mb-6">
                <img src={globeIcon} alt="Universal Message" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">Universal Message</h3>
              <p className="text-[#86868b] font-medium leading-relaxed">
                No language barriers. <span className="text-[#1d1d1f]">A gesture anyone can understand and share across cultures.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spread the Butterfly Slider Section */}
      <section className="py-24 bg-[#f5f5f7] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-10 flex flex-col md:flex-row md:justify-between md:items-end">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f]">
            How to spread the Butterfly
          </h2>
        </div>

        <div className="relative w-full">
          <div
            ref={spreadSliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-4 list-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Left Spacer */}
            <div className="flex-shrink-0 snap-start" style={{ width: 'max(1rem, calc(50vw - 700px + 2rem))' }} />

            {[
              {
                step: "1",
                title: "Create Content",
                desc: "Make a video, post, or stream demonstrating the Butterfly gesture. Show your audience how simple it is and why it matters.",
                img: createContentImg
              },
              {
                step: "2",
                title: "Use the Hashtag",
                desc: "Tag your content with #ButterflyGesture and #988Lifeline to join the movement.",
                img: useHashtagImg
              },
              {
                step: "3",
                title: "Challenge Your Followers",
                desc: "Ask your community to learn the gesture and share it with others. Create a viral challenge that saves lives.",
                img: challengeImg
              },
              {
                step: "4",
                title: "Link This Page",
                desc: "Direct your followers here to learn more. Together, we can make every American aware of the Butterfly gesture.",
                img: linkPageImg
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`w-[85vw] sm:w-[340px] md:w-[400px] h-[500px] md:h-[550px] bg-white rounded-[2rem] p-8 md:p-10 flex flex-col hover:shadow-xl transition-shadow duration-300 relative overflow-hidden flex-shrink-0 group ${idx !== 3 ? 'mr-4 md:mr-6' : ''} snap-start`}
              >
                <div className="flex flex-col z-10">
                  <span className="text-xs font-bold text-[#86868b] tracking-wider uppercase mb-3 block">Step {item.step}</span>
                  <h3 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-3 leading-snug tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[15px] md:text-base text-[#1d1d1f] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[220px] md:h-[260px] flex items-end justify-center">
                  <img src={item.img} alt={item.title} className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-500 ease-out" />
                </div>


              </div>
            ))}

            {/* Right Spacer */}
            <div className="flex-shrink-0" style={{ width: 'max(1rem, calc(50vw - 700px + 2rem))' }} />
          </div>
        </div>

        {/* Navigation Arrows (Apple Screenshot style) */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6 flex justify-end">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => scrollSpreadSlider('left')}
              className="w-10 h-10 rounded-full bg-[#e8e8ed] hover:bg-[#d2d2d7] flex items-center justify-center transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 text-[#1d1d1f] group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => scrollSpreadSlider('right')}
              className="w-10 h-10 rounded-full bg-[#e8e8ed] hover:bg-[#d2d2d7] flex items-center justify-center transition-colors group"
            >
              <ChevronRight className="w-5 h-5 text-[#1d1d1f] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-32 px-4 bg-white border-t border-[#d2d2d7]">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="w-24 h-24 md:w-28 md:h-28 mb-8 flex items-center justify-center">
            <img src={showItIcon} alt="Show It gesture" className="w-full h-full object-contain drop-shadow-sm hover:scale-105 transition-transform duration-500" />
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#1d1d1f] mb-6">
            Ready to make a <span style={{ backgroundImage: 'linear-gradient(90deg, #32d4a1 0%, #3167fd 50%, #9943d5 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>difference?</span>
          </h2>
          <p className="text-xl md:text-2xl text-[#86868b] font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            If you or someone you know is in immediate danger, don't wait.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:988"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#1d1d1f] text-white px-8 py-4 rounded-full font-medium text-lg hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call 988</span>
            </a>

            <button
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-[#f5f5f7] text-[#1d1d1f] border border-[#d2d2d7] px-8 py-4 rounded-full font-medium text-lg hover:bg-[#e8e8ed] transition-colors duration-300"
            >
              <Share2 className="w-5 h-5" />
              <span>Share on Social</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] border-t border-[#d2d2d7] py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <img src={blogoSvg} alt="Butterfly Project Logo" className="w-5 h-5 filter brightness-0 opacity-90 transition-opacity hover:opacity-100" />
              <span className="font-semibold tracking-tight text-[#1d1d1f] text-sm">Butterfly Project</span>
            </div>
            <p className="text-xs text-[#86868b] font-medium leading-relaxed">
              Our mission is to make the Butterfly gesture a universal standard for crisis assistance in workplaces and streams.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">Emergency Resources</h4>
            <ul className="space-y-2">
              <li><a href="tel:988" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium">Call or Text 988 (USA)</a></li>
              <li><a href="https://findahelpline.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium">Find International Help</a></li>
              <li><a href="https://www.crisistextline.org/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium">Crisis Text Line (Text HOME to 741741)</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">Join the Cause</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium">Brand Assets & Kits</a></li>
              <li><a href="#" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium">Advocacy & Outreach</a></li>
              <li><a href="#" className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium">Corporate Programs</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-[#d2d2d7] flex flex-col md:flex-row justify-between items-center text-[#86868b] text-xs font-medium">
          <p>© 2026 Butterfly Project. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Design inspired by Apple standard. Focus on clarity and simplicity.</p>
        </div>
      </footer>
    </div>
  );
}
