import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Star, MessageCircle, MapPin, Sparkles, Bell, Video, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

type Profile = {
  id: number;
  name: string;
  age: number;
  city: string;
  distance: number;
  bio: string;
  interests: string[];
  image: string;
  gradient: string;
};

const profiles: Profile[] = [
  { id: 1, name: "נועה", age: 26, city: "תל אביב", distance: 2, bio: "מעצבת גרפית, אוהבת קפה בבוקר ושקיעות בים. מחפשת מישהו לטיולים ארוכים ושיחות עמוקות.", interests: ["צילום", "יוגה", "בישול", "מסעדנות"], image: "", gradient: "from-rose-400 via-pink-500 to-fuchsia-500" },
  { id: 2, name: "איתי", age: 29, city: "חיפה", distance: 5, bio: "מהנדס תוכנה, גיטריסט וחובב טבע. נהנה מטיולים בצפון ומבירות ערב.", interests: ["מוזיקה", "טיולים", "קולנוע", "קריאה"], image: "", gradient: "from-amber-400 via-orange-500 to-red-500" },
  { id: 3, name: "שירה", age: 24, city: "ירושלים", distance: 8, bio: "סטודנטית לפסיכולוגיה, אוהבת ספרים וכלבים. מחפשת קשר רציני עם בן אדם חם ואמיתי.", interests: ["קריאה", "כלבים", "פסיכולוגיה", "אמנות"], image: "", gradient: "from-violet-400 via-purple-500 to-indigo-500" },
  { id: 4, name: "דניאל", age: 31, city: "תל אביב", distance: 1, bio: "יזם בנשמה, אוהב כושר ואוכל טוב. מחפש מישהי שתצא איתי להרפתקאות.", interests: ["כושר", "סטארטאפים", "אוכל", "נסיעות"], image: "", gradient: "from-emerald-400 via-teal-500 to-cyan-500" },
  { id: 5, name: "מאיה", age: 27, city: "ראשון לציון", distance: 4, bio: "וטרינרית שאוהבת חיות וטבע. בזמני הפנוי אני מתנדבת במקלט חתולים.", interests: ["חיות", "טבע", "התנדבות", "סרטים"], image: "", gradient: "from-sky-400 via-blue-500 to-indigo-500" },
  { id: 6, name: "עומר", age: 28, city: "נתניה", distance: 6, bio: "שף במקצוע, גולש בנשמה. אוהב לבשל ארוחות ערב רומנטיות ולצאת לים.", interests: ["בישול", "גלישה", "ים", "יין"], image: "", gradient: "from-orange-400 via-amber-500 to-yellow-500" },
];

type Screen = "login" | "discover" | "matches" | "chat";
type Match = { profile: Profile; messages: { from: "me" | "them"; text: string }[] };

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [notifCount, setNotifCount] = useState(2);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "ברוכים הבאים ל-LoveMatch! התחל/י להחליק ולמצוא התאמות 🔥",
    "יש לך 3 פרופילים חדשים באזורך שמחכים לך",
  ]);

  const current = profiles[currentIdx];

  const handleLike = () => {
    if (Math.random() > 0.4) {
      setMatches((prev) => [...prev, { profile: current, messages: [] }]);
      setNotifications((prev) => [`${current.name} ואת/ה עשיתם Match! 🎉`, ...prev]);
      setNotifCount((c) => c + 1);
      toast.success(`Match חדש עם ${current.name}! 🎉`, { description: "תתחיל/י לשוחח עכשיו" });
    }
    setCurrentIdx((i) => (i + 1) % profiles.length);
  };

  const handlePass = () => {
    setCurrentIdx((i) => (i + 1) % profiles.length);
  };

  const handleSuperLike = () => {
    setMatches((prev) => [...prev, { profile: current, messages: [] }]);
    setNotifications((prev) => [`שלח/ת Super Like ל-${current.name} ⭐ ועשיתם Match!`, ...prev]);
    setNotifCount((c) => c + 1);
    toast.success(`Super Like ל-${current.name}! ⭐`);
    setCurrentIdx((i) => (i + 1) % profiles.length);
  };

  const sendMessage = (text: string) => {
    if (!activeChat) return;
    setMatches((prev) =>
      prev.map((m) =>
        m.profile.id === activeChat
          ? { ...m, messages: [...m.messages, { from: "me", text }] }
          : m
      )
    );
    setTimeout(() => {
      setMatches((prev) =>
        prev.map((m) =>
          m.profile.id === activeChat
            ? { ...m, messages: [...m.messages, { from: "them", text: getReply() }] }
            : m
        )
      );
    }, 1200);
  };

  const getReply = () => {
    const replies = ["נשמע מעניין! 😊", "גם אני אוהב/ת את זה!", "ספר/י לי עוד 🌟", "נדמה לי שנסתדד מצוין 😄", "מתי ניפגש? ☕"];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50" dir="rtl">
      <Toaster position="top-center" richColors />
      <Header
        screen={screen}
        setScreen={setScreen}
        matchCount={matches.length}
        notifCount={notifCount}
        onNotifClick={() => { setShowNotifs(!showNotifs); setNotifCount(0); }}
      />

      <AnimatePresence>
        {showNotifs && (
          <NotificationsPanel notifications={notifications} onClose={() => setShowNotifs(false)} />
        )}
      </AnimatePresence>

      <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
        <AnimatePresence mode="wait">
          {screen === "discover" && (
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DiscoverScreen
                profile={current}
                onLike={handleLike}
                onPass={handlePass}
                onSuperLike={handleSuperLike}
              />
            </motion.div>
          )}
          {screen === "matches" && (
            <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MatchesScreen matches={matches} onOpenChat={(id) => { setActiveChat(id); setScreen("chat"); }} />
            </motion.div>
          )}
          {screen === "chat" && activeChat && (
            <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <ChatScreen
                match={matches.find((m) => m.profile.id === activeChat)!}
                onSend={sendMessage}
                onBack={() => { setScreen("matches"); setActiveChat(null); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav screen={screen} setScreen={setScreen} matchCount={matches.length} />
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [step, setStep] = useState<"welcome" | "phone" | "verify" | "profile">("welcome");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600" dir="rtl">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md">
        <Card className="rounded-3xl shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg mb-4">
                <Heart className="w-8 h-8 text-white fill-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">LoveMatch</h1>
              <p className="text-slate-500 mt-2 text-sm">האתר להיכרויות בחינם לחלוטין</p>
            </div>

            {step === "welcome" && (
              <div className="space-y-4">
                <Button onClick={() => setStep("phone")} className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white font-semibold text-base">
                  התחברות עם SMS / אימייל
                </Button>
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400">או התחברות מהירה</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <Button variant="outline" onClick={onLogin} className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-medium">
                  <span className="text-blue-600 font-bold ml-2">G</span> המשך עם Google
                </Button>
                <Button variant="outline" onClick={onLogin} className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50 font-medium">
                  <span className="text-blue-700 font-bold ml-2">f</span> המשך עם Facebook
                </Button>
              </div>
            )}

            {step === "phone" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-700 font-medium">מספר טלפון או אימייל</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="050-1234567 או you@email.com"
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>
                <Button
                  onClick={() => { toast.success("קוד אימות נשלח!"); setStep("verify"); }}
                  disabled={!phone}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white font-semibold"
                >
                  שלח קוד אימות
                </Button>
                <Button variant="ghost" onClick={() => setStep("welcome")} className="w-full text-slate-500">חזרה</Button>
              </div>
            )}

            {step === "verify" && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-slate-600 text-sm">הזן/י את הקוד שנשלח אליך</p>
                  <p className="text-rose-600 font-semibold mt-1">{phone}</p>
                </div>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="• • • •"
                  maxLength={4}
                  className="text-center text-2xl tracking-8 h-14 rounded-xl font-bold"
                />
                <Button
                  onClick={() => { setStep("profile"); toast.success("אומת בהצלחה!"); }}
                  disabled={code.length < 4}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white font-semibold"
                >
                  אימות
                </Button>
              </div>
            )}

            {step === "profile" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-700 font-medium">איך קוראים לך?</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="השם שלך" className="mt-2 h-12 rounded-xl" />
                </div>
                <Button
                  onClick={() => { toast.success(`ברוך הבא ${name || "אליך"}!`); onLogin(); }}
                  disabled={!name}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 text-white font-semibold"
                >
                  התחל/י עכשיו!
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-white/80 text-xs mt-6">בחינם לחלוטין • ללא תשלום • ללא מנוי</p>
      </motion.div>
    </div>
  );
}

function Header({ screen, setScreen, matchCount, notifCount, onNotifClick }: {
  screen: Screen; setScreen: (s: Screen) => void; matchCount: number; notifCount: number; onNotifClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-rose-100">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => setScreen("discover")} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">LoveMatch</span>
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onNotifClick} className="relative w-10 h-10 rounded-full hover:bg-rose-50 flex items-center justify-center transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            {notifCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
                {notifCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function NotificationsPanel({ notifications, onClose }: { notifications: string[]; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-16 left-4 right-4 z-50 max-w-2xl mx-auto"
      >
        <Card className="rounded-2xl shadow-xl border-rose-100 overflow-hidden">
          <CardHeader className="bg-rose-50 pb-3">
            <CardTitle className="text-base text-slate-800">התראות</CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-slate-400 py-8 text-sm">אין התראות חדשות</p>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="px-4 py-3 border-b border-slate-50 hover:bg-rose-50/50 transition-colors flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-sm text-slate-700">{n}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}

function DiscoverScreen({ profile, onLike, onPass, onSuperLike }: {
  profile: Profile; onLike: () => void; onPass: () => void; onSuperLike: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-bold text-slate-800">גלה/י התאמות</h2>
        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-0">
          <MapPin className="w-3 h-3 ml-1" /> {profile.distance} ק"מ
        </Badge>
      </div>

      <motion.div
        key={profile.id}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <Card className="overflow-hidden rounded-3xl shadow-xl border-0">
          <div className={`relative h-96 bg-gradient-to-br ${profile.gradient} flex items-center justify-center`}>
            <span className="text-7xl font-bold text-white/30">{profile.name.charAt(0)}</span>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">{profile.name}, {profile.age}</h3>
                  <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {profile.city} • {profile.distance} ק"מ ממך
                  </p>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            <p className="text-slate-600 text-sm leading-relaxed">{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onPass}
          className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-slate-100"
        >
          <X className="w-7 h-7 text-slate-400" />
        </button>
        <button
          onClick={onSuperLike}
          className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-slate-100"
        >
          <Star className="w-6 h-6 text-blue-500 fill-blue-500" />
        </button>
        <button
          onClick={onLike}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Heart className="w-8 h-8 text-white fill-white" />
        </button>
      </div>
    </div>
  );
}

function MatchesScreen({ matches, onOpenChat }: { matches: Match[]; onOpenChat: (id: number) => void }) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 mb-4">
          <Heart className="w-10 h-10 text-rose-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700">עדיין אין התאמות</h3>
        <p className="text-slate-400 mt-2 text-sm">התחל/י להחליק כדי למצוא התאמות!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 px-2">ההתאמות שלי ({matches.length})</h2>
      <div className="grid grid-cols-2 gap-3">
        {matches.map((match) => (
          <motion.div key={match.profile.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card
              className="overflow-hidden rounded-2xl shadow-md border-0 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onOpenChat(match.profile.id)}
            >
              <div className={`relative h-32 bg-gradient-to-br ${match.profile.gradient} flex items-center justify-center`}>
                <span className="text-4xl font-bold text-white/30">{match.profile.name.charAt(0)}</span>
                {match.messages.length > 0 && (
                  <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
                    {match.messages.length}
                  </span>
                )}
              </div>
              <CardContent className="p-3">
                <p className="font-semibold text-slate-800 text-sm">{match.profile.name}, {match.profile.age}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {match.profile.city}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ChatScreen({ match, onSend, onBack }: {
  match: Match; onSend: (text: string) => void; onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-2">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 text-sm font-medium">חזרה</button>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${match.profile.gradient} flex items-center justify-center`}>
          <span className="text-white font-bold">{match.profile.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-800">{match.profile.name}</p>
          <p className="text-xs text-emerald-500">מחובר/ת עכשיו</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowVideo(!showVideo)} className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50">
          <Video className="w-4 h-4 ml-1" /> וידאו
        </Button>
      </div>

      {showVideo && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card className="rounded-2xl overflow-hidden border-0 shadow-lg">
            <div className={`h-48 bg-gradient-to-br ${match.profile.gradient} flex flex-col items-center justify-center relative`}>
              <div className="absolute top-2 right-2 bg-black/30 rounded-lg px-2 py-1 text-white text-xs flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> שיחת וידאו פעילה
              </div>
              <span className="text-5xl mb-2">{match.profile.name.charAt(0)}</span>
              <p className="text-white/80 text-sm">{match.profile.name}</p>
            </div>
            <div className="p-3 flex items-center justify-center gap-3 bg-slate-50">
              <Button size="sm" variant="outline" className="rounded-full">השתק</Button>
              <Button size="sm" className="rounded-full bg-red-500 hover:bg-red-600 text-white">סיום שיחה</Button>
              <Button size="sm" variant="outline" className="rounded-full">מצלמה</Button>
            </div>
          </Card>
        </motion.div>
      )}

      <Card className="rounded-2xl border-0 shadow-md h-96 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {match.messages.length === 0 ? (
            <div className="text-center py-10">
              <MessageCircle className="w-10 h-10 text-rose-200 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">שלח/י הודעה ראשונה!</p>
            </div>
          ) : (
            match.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "me" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.from === "me" ? "bg-rose-500 text-white rounded-bl-sm" : "bg-slate-100 text-slate-700 rounded-br-sm"}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <div className="border-t border-slate-100 p-3 flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="כתוב/י הודעה..."
            className="rounded-full h-11"
          />
          <Button onClick={handleSend} className="rounded-full h-11 w-11 p-0 bg-gradient-to-br from-rose-500 to-pink-600 hover:opacity-90">
            <Heart className="w-5 h-5 fill-white" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function BottomNav({ screen, setScreen, matchCount }: { screen: Screen; setScreen: (s: Screen) => void; matchCount: number }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-t border-rose-100">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-around">
        <button
          onClick={() => setScreen("discover")}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors ${screen === "discover" ? "text-rose-600" : "text-slate-400"}`}
        >
          <Heart className={`w-6 h-6 ${screen === "discover" ? "fill-rose-600" : ""}`} />
          <span className="text-xs font-medium">גלה/י</span>
        </button>
        <button
          onClick={() => setScreen("matches")}
          className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors relative ${screen === "matches" || screen === "chat" ? "text-rose-600" : "text-slate-400"}`}
        >
          <MessageCircle className={`w-6 h-6 ${screen === "matches" || screen === "chat" ? "fill-rose-600" : ""}`} />
          <span className="text-xs font-medium">התאמות</span>
          {matchCount > 0 && (
            <span className="absolute top-0 right-8 w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
              {matchCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}