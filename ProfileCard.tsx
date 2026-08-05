import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { Heart, X, MapPin, ShieldCheck, Video } from "lucide-react";
import { Profile } from "@/types";

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
  onVideo: (profile: Profile) => void;
  isTop: boolean;
  index: number;
}

export function ProfileCard({ profile, onSwipe, onVideo, isTop, index }: ProfileCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [40, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -40], [1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe("right");
    else if (info.offset.x < -100) onSwipe("left");
  };

  if (!isTop) {
    return (
      <div
        className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-white"
        style={{ zIndex: index, transform: `scale(${1 - index * 0.04}) translateY(${index * 12}px)` }}
      >
        <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, zIndex: index }}
      initial={{ scale: 1 - index * 0.04, y: index * 12 }}
      className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing bg-slate-200"
    >
      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover pointer-events-none" />

      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-8 right-8 border-4 border-green-500 text-green-500 rounded-2xl px-6 py-2 text-3xl font-bold rotate-12 bg-white/90"
      >
        LIKE
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-8 left-8 border-4 border-rose-500 text-rose-500 rounded-2xl px-6 py-2 text-3xl font-bold -rotate-12 bg-white/90"
      >
        NOPE
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h3 className="text-3xl font-bold flex items-center gap-2">
              {profile.name}
              <span className="text-xl font-light opacity-80">{profile.age}</span>
              {profile.verified && <ShieldCheck className="w-5 h-5 text-sky-400 fill-sky-400/20" />}
            </h3>
            <p className="flex items-center gap-1 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              {profile.city} • {profile.distance} ק"מ ממך
            </p>
          </div>
          {profile.online && (
            <div className="flex items-center gap-1.5 bg-green-500/90 px-3 py-1 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              מחובר
            </div>
          )}
        </div>

        <p className="text-sm opacity-90 mb-3 line-clamp-2">{profile.bio}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {profile.interests.slice(0, 4).map((interest) => (
            <span key={interest} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
              {interest}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onVideo(profile); }}
          className="pointer-events-auto flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
        >
          <Video className="w-4 h-4" />
          שיחת וידאו
        </button>
      </div>
    </motion.div>
  );
}