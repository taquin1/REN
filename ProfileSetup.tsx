import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types";

const interestOptions = [
  "אמנות", "מוזיקה", "ספרים", "ספורט", "טיולים", "בישול",
  "צילום", "סרטים", "טכנולוגיה", "יוגה", "כלבים", "חתולים",
  "יין", "קפה", "ריצה", "גלישה", "משחקי קופסה", "אופנה",
];

interface ProfileSetupProps {
  onComplete: (user: User) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [image, setImage] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 5
        ? [...prev, interest]
        : prev
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onComplete({
      name,
      age: parseInt(age),
      city,
      bio,
      interests,
      image:
        image ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80",
    });
  };

  const canProceed = step === 0 ? name && age && city : step === 1 ? bio.length > 10 : interests.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-3xl font-bold text-slate-800">לב חם</span>
          </div>
          <p className="text-slate-500 text-sm">היכרויות חינמיות לחלוטין</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-rose-200/40 border border-rose-100 overflow-hidden">
          <div className="flex gap-2 p-4 bg-rose-50/50 border-b border-rose-100">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-rose-500" : "bg-rose-200"
                }`}
              />
            ))}
          </div>

          <div className="p-6">
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">בואו נכיר אותך</h2>
                <p className="text-slate-500 text-sm">ספר לנו קצת על עצמך כדי שנתחיל</p>

                <div className="flex justify-center mb-4">
                  <label className="cursor-pointer group">
                    <div className="w-28 h-28 rounded-full border-4 border-dashed border-rose-200 group-hover:border-rose-400 transition-colors flex items-center justify-center overflow-hidden bg-rose-50">
                      {image ? (
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-rose-400 text-sm text-center px-2">הוסף תמונה</span>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="לדוגמה: דנה כהן" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="age">גיל</Label>
                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">עיר</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="תל אביב" />
                  </div>
                </div>

                <Button
                  onClick={() => setStep(1)}
                  disabled={!canProceed}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 text-base font-semibold"
                >
                  המשך
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <button onClick={() => setStep(0)} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm">
                  <ArrowLeft className="w-4 h-4" /> חזור
                </button>
                <h2 className="text-2xl font-bold text-slate-800">ספר על עצמך</h2>
                <p className="text-slate-500 text-sm">כמה משפטים שיעזרו לאחרים להכיר אותך</p>

                <div className="space-y-2">
                  <Label htmlFor="bio">ביו</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="אני אדם שאוהב..."
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-slate-400 text-left">{bio.length}/300</p>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceed}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 text-base font-semibold"
                >
                  המשך
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm">
                  <ArrowLeft className="w-4 h-4" /> חזור
                </button>
                <h2 className="text-2xl font-bold text-slate-800">תחומי עניין</h2>
                <p className="text-slate-500 text-sm flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  בחר לפחות 3 (ניתן עד 5)
                </p>

                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => {
                    const selected = interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selected
                            ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-xl h-12 text-base font-semibold shadow-lg shadow-rose-500/30"
                  >
                    {canProceed ? "בוא נתחיל להכיר! 🎉" : `בחר עוד ${3 - interests.length} תחומים`}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}