import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, X, MessageCircle, User as UserIcon, LogOut, MapPin,
  Sparkles, RotateCcw, Video, VideoOff, Mic, MicOff, PhoneOff,
  Bell, ShieldCheck, Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthScreen } from "@/components/AuthScreen";
import { ProfileCard } from "@/components/ProfileCard";
import { sampleProfiles } from "@/data/profiles";
import { Profile, User, View } from "@/types";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>("discover");
  const [profiles, setProfiles] = useState<Profile[]>(sampleProfiles);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [matchPopup, setMatchPopup] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<{ id: string; text: string; icon: string }[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [videoCall, setVideoCall] = useState<Profile | null>(null);
  const [callState, setCallState] = useState<"ringing" | "connected" | "ended">("ringing");
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const msgs = [
        { text: "מאיה שלחה לך הודעה חדשה!", icon: "message" },
        { text: "יש לך התאמה חדשה עם רון!", icon: "heart" },
        { text: "שירה צפתה בפרופיל שלך", icon: "eye" },
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setNotifications((prev) => [{ id: Date.now().toString(), ...msg }, ...prev].slice(0, 10));
    }, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleAuth = (method: "google" | "facebook" | "sms" | "email", identifier: string) => {
    setUser({
      name: "דנה כהן",
      age: 26,
      city: "תל אביב",
      bio: "אוהבת חיים, קפה והרפתקאות. מחפשת מישהו כנה ומצחיק.",
      interests: ["קפה", "טיולים", "סרטים", "יוגה"],
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80",
      authMethod: method,
      verified: method === "sms" || method === "email",
      location: { lat: 32.0853, lng: 34.7818, label: "תל אביב" },
    });
  };

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const [current, ...rest] = profiles;
      if (!current) return;
      if (direction === "right") {
        setMatches((prev) => [...prev, current]);
        if (Math.random() > 0.4) {
          setMatchPopup(current);
          setNotifications((prev) => [{ id: Date.now().toString(), text: `יש התאמה חדשה עם ${current.name}!`, icon: "heart" }, ...prev].slice(0, 10));
        }
      }
      setProfiles(rest);
    },
    [profiles]
  );

  const resetDeck = () => setProfiles(sampleProfiles);

  const startVideoCall = (profile: Profile) => {
    setVideoCall(profile);
    setCallState("ringing");
    setTimeout(() => setCallState("connected"), 2500);
  };

  const endCall = () => {
    setCallState("ended");
    setTimeout(() => setVideoCall(null), 500);
  };

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  const topProfile = profiles[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-rose-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-md shadow-rose-500/30">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">לב חם</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setView("discover")}
              className={`p-2 rounded-xl transition-colors ${view === "discover" ? "bg-rose-100 text-rose-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("matches")}
              className={`p-2 rounded-xl transition-colors relative ${view === "matches" ? "bg-rose-100 text-rose-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <MessageCircle className="w-5 h-5" />
              {matches.length > 0 && (
                <span className="absolute top-1 left-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {matches.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setView("profile")}
              className={`p-2 rounded-xl transition-colors ${view === "profile" ? "bg-rose-100 text-rose-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl transition-colors text-slate-400 hover:text-slate-600 relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 left-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifs && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifs(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50 bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">התראות</h3>
                <button onClick={() => setNotifications([])} className="text-xs text-rose-500 hover:underline">נקה הכל</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-6 text-center text-sm text-slate-400">אין התראות חדשות</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="flex items-center gap-3 p-3 hover:bg-rose-50/50 transition-colors border-b border-slate-50">
                      <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        {n.icon === "heart" && <Heart className="w-4 h-4 text-rose-500" />}
                        {n.icon === "message" && <MessageCircle className="w-4 h-4 text-rose-500" />}
                        {n.icon === "eye" && <Sparkles className="w-4 h-4 text-rose-500" />}
                      </div>
                      <p className="text-sm text-slate-700">{n.text}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        <AnimatePresence mode="wait">
          {view === "discover" && (
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Location Bar */}
              <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-sm border border-rose-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">המיקום שלך</p>
                    <p className="text-sm font-semibold text-slate-700">{user.location.label}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400">{profiles.length} פרופילים בקרבתך</span>
              </div>

              {/* Card Stack */}
              <div className="relative w-full h-[500px] mb-6">
                {profiles.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                      <Heart className="w-10 h-10 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">זה הכל לעכשיו!</h3>
                    <p className="text-slate-500 text-sm mb-4">אין עוד פרופילים באזור שלך</p>
                    <Button onClick={resetDeck} variant="outline" className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50">
                      <RotateCcw className="w-4 h-4 ml-2" />
                      טען מחדש
                    </Button>
                  </div>
                ) : (
                  <>
                    {profiles.slice(0, 3).reverse().map((profile, idx) => {
                      const realIndex = profiles.length - 1 - idx;
                      const isTop = realIndex === 0;
                      return (
                        <ProfileCard
                          key={profile.id}
                          profile={profile}
                          onSwipe={handleSwipe}
                          onVideo={startVideoCall}
                          isTop={isTop}
                          index={realIndex}
                        />
                      );
                    })}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              {profiles.length > 0 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleSwipe("left")}
                    className="w-14 h-14 rounded-full bg-white shadow-lg shadow-slate-200/60 border border-slate-100 flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-transform"
                  >
                    <X className="w-7 h-7" />
                  </button>
                  <button
                    onClick={() => handleSwipe("right")}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/40 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Heart className="w-8 h-8 fill-white" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {view === "matches" && (
            <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">ההתאמות שלי</h2>
              {matches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                    <MessageCircle className="w-10 h-10 text-rose-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-1">אין עדיין התאמות</h3>
                  <p className="text-slate-500 text-sm">התחל להחליק כדי למצוא התאמות!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {matches.map((match) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-md border border-rose-100 hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img src={match.image} alt={match.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => startVideoCall(match)}
                          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                        >
                          <Video className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-slate-800 flex items-center gap-1">
                            {match.name}, {match.age}
                            {match.verified && <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />}
                          </h3>
                          {match.online && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {match.distance} ק"מ
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="bg-white rounded-3xl shadow-md border border-rose-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-rose-400 to-orange-400 relative">
                  <div className="absolute -bottom-12 right-6">
                    <Avatar className="w-24 h-24 border-4 border-white rounded-2xl shadow-lg">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="text-2xl font-bold bg-rose-100 text-rose-600 rounded-2xl">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="pt-14 pb-6 px-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-800">{user.name}, {user.age}</h2>
                    {user.verified ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-sky-600 bg-sky-50 px-2 py-1 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        מאומת
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">לא מאומת</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {user.city}
                  </p>
                  <p className="text-slate-600 text-sm mt-4 leading-relaxed">{user.bio}</p>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-400 mb-2">תחומי עניין</p>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest) => (
                        <span key={interest} className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-medium">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 mb-2">שיטת אימות</p>
                    <p className="text-sm text-slate-700 capitalize">
                      {user.authMethod === "google" && "Google"}
                      {user.authMethod === "facebook" && "Facebook"}
                      {user.authMethod === "sms" && "SMS"}
                      {user.authMethod === "email" && "אימייל"}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => { setUser(null); setMatches([]); setProfiles(sampleProfiles); setNotifications([]); }}
                variant="outline"
                className="w-full rounded-xl h-12 border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4 ml-2" />
                התנתק
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Match Popup */}
      <AnimatePresence>
        {matchPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMatchPopup(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/40">
                    <Heart className="w-10 h-10 text-white fill-white" />
                  </div>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute -inset-2">
                    <Sparkles className="w-5 h-5 text-amber-400 absolute top-0 right-0" />
                    <Sparkles className="w-4 h-4 text-amber-400 absolute bottom-0 left-0" />
                  </motion.div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">יש התאמה! 🎉</h2>
              <p className="text-slate-500 mb-6">
                אתה ו<span className="font-bold text-rose-600">{matchPopup.name}</span> אהבתם אחד את השני
              </p>
              <div className="flex gap-3">
                <Button onClick={() => { setMatchPopup(null); setView("matches"); }} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12">
                  <MessageCircle className="w-4 h-4 ml-2" />
                  צ'אט
                </Button>
                <Button onClick={() => { startVideoCall(matchPopup); setMatchPopup(null); }} variant="outline" className="flex-1 rounded-xl h-12 border-rose-200 text-rose-600 hover:bg-rose-50">
                  <Video className="w-4 h-4 ml-2" />
                  וידאו
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Call Modal */}
      <AnimatePresence>
        {videoCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900 flex flex-col"
          >
            {/* Remote Video (simulated) */}
            <div className="flex-1 relative overflow-hidden">
              <img src={videoCall.image} alt={videoCall.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

              {/* Call Info */}
              <div className="absolute top-6 left-0 right-0 text-center text-white">
                <h3 className="text-xl font-bold">{videoCall.name}</h3>
                <p className="text-sm opacity-80">
                  {callState === "ringing" && "מחייג..."}
                  {callState === "connected" && "מחובר"}
                  {callState === "ended" && "השיחה הסתיימה"}
                </p>
              </div>

              {/* Self Video (PiP) */}
              <div className="absolute top-6 right-6 w-24 h-32 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg bg-slate-800">
                {videoOff ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-slate-500" />
                  </div>
                ) : (
                  <img src={user.image} alt="me" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Controls */}
              <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
                <button
                  onClick={() => setMuted(!muted)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${muted ? "bg-white text-slate-800" : "bg-white/20 text-white backdrop-blur-md"}`}
                >
                  {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setVideoOff(!videoOff)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${videoOff ? "bg-white text-slate-800" : "bg-white/20 text-white backdrop-blur-md"}`}
                >
                  {videoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
                <button
                  onClick={endCall}
                  className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/40 transition-colors"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}