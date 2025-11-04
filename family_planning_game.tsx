import React, { useState, useEffect } from 'react';
import { Heart, Users, Award, ChevronRight, CheckCircle, XCircle, BookOpen, MessageSquare, Trophy, Star, Zap, Clock, Target, TrendingUp } from 'lucide-react';

const FamilyPlanningGame = () => {
  const [gameState, setGameState] = useState('menu');
  const [currentScenario, setCurrentScenario] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [comboMultiplier, setComboMultiplier] = useState(1);

  const allAchievements = [
    { id: 'first_correct', title: '🎯 İlk Başarı', desc: 'İlk doğru cevap', xp: 50 },
    { id: 'perfect_scenario', title: '💯 Mükemmel Danışmanlık', desc: 'Bir senaryoyu hatasız tamamla', xp: 150 },
    { id: 'streak_3', title: '🔥 Üçlü Kombo', desc: '3 doğru cevap üst üste', xp: 100 },
    { id: 'streak_5', title: '⚡ Beşli Kombo', desc: '5 doğru cevap üst üste', xp: 200 },
    { id: 'speed_demon', title: '⏱️ Hız Canavarı', desc: '10 saniyeden hızlı cevapla', xp: 75 },
    { id: 'all_scenarios', title: '🏆 Uzman Hemşire', desc: 'Tüm senaryoları tamamla', xp: 500 },
    { id: 'level_5', title: '📈 Seviye 5', desc: '5. seviyeye ulaş', xp: 300 }
  ];

  const scenarios = [
    {
      id: 1,
      title: "Yeni Evli Çift",
      description: "Genç bir çift 2-3 yıl gebeliği ertelemek istiyor",
      difficulty: "Kolay",
      patient: {
        name: "Ayşe & Mehmet",
        age: "26 & 28 yaş",
        background: "Yeni evli, ikisi de çalışan profesyoneller",
        concerns: "Gelecekte çocuk sahibi olmayı etkilemeyecek etkili bir yöntem istiyorlar"
      },
      dialogues: [
        {
          question: "Çift soruyor: 'Birkaç yıl sonra çocuk istiyorsak bizim için en iyi yöntem hangisi?'",
          timeLimit: 30,
          options: [
            { text: "Evli olduğunuz için kalıcı sterilizasyon öneriyorum", correct: false, feedback: "❌ Yanlış. Sterilizasyon gelecekte çocuk planlayanlar için uygun değil. Kalıcıdır ve geri döndürülemez." },
            { text: "Kombine oral kontraseptifler veya RİA mükemmel seçenekler - ikisi de çok etkili ve tamamen geri dönüşümlü", correct: true, feedback: "✓ Doğru! Bu yöntemler %99'dan fazla etkili, gelecekteki doğurganlığı etkilemiyor ve çocuk istediklerinde hemen bırakılabiliyor." },
            { text: "Geri çekme yöntemini kullanın, doğal ve ücretsiz", correct: false, feedback: "❌ Yanlış. Geri çekme yöntemi yüksek başarısızlık oranına sahip (%22) ve gebeliği önlemede güvenilir değil." }
          ]
        },
        {
          question: "Ayşe bazen günlük ilaçlarını almayı unuttuğunu söylüyor. Tavsiyeniz nedir?",
          timeLimit: 30,
          options: [
            { text: "Hapları her gün mutlaka almalısınız, başka seçenek yok", correct: false, feedback: "❌ Bu yaklaşım hasta endişelerini göz ardı ediyor ve hasta merkezli bakım sağlamıyor." },
            { text: "Günlük dikkat gerektirmeyen RİA veya implant gibi uzun etkili bir yöntem düşünün", correct: true, feedback: "✓ Mükemmel! Hastanın yaşam tarzı ihtiyaçlarını fark ettiniz. Uzun etkili geri dönüşümlü kontraseptifler günlük hatırlamayı tercih etmeyenler için ideal." },
            { text: "Hapı hatırlamak için birden fazla telefon alarmı kurun", correct: false, feedback: "❌ Bu yardımcı olabilir ama asıl sorunu çözmüyor. Hastanın yaşam tarzına uygun yöntemler önermek daha iyi." }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Doğum Sonrası Anne",
      description: "Doğumdan 6 hafta sonra, sadece emziren bir anne",
      difficulty: "Orta",
      patient: {
        name: "Fatma",
        age: "32 yaş",
        background: "İkinci çocuğu, tamamen emziriyor",
        concerns: "Doğum kontrolünün süt üretimini etkileyeceğinden endişeli"
      },
      dialogues: [
        {
          question: "Fatma soruyor: 'Emzirirken doğum kontrolü kullanabilir miyim? Bebeğime zarar verir mi?'",
          timeLimit: 35,
          options: [
            { text: "Emzirirken hiçbir kontraseptif yöntem kullanamazsınız", correct: false, feedback: "❌ Yanlış. Emzirme sırasında güvenli birçok kontraseptif yöntem var." },
            { text: "Sadece progestin içeren yöntemler (mini hap, implant, RİA) emzirme için güvenli ve süt üretimini etkilemez", correct: true, feedback: "✓ Mükemmel! Sadece progestin içeren kontraseptifler emziren anneler için önerilir. Süt üretimini azaltmaz ve bebek için güvenlidir." },
            { text: "Kombine oral kontraseptifler kullanın, en etkili olanlar", correct: false, feedback: "❌ Yanlış. Kombine kontraseptifler (östrojen içeren) süt üretimini azaltabilir ve emzirmenin ilk 6 ayında önerilmez." }
          ]
        },
        {
          question: "Bir sonraki gebeliğini en az 2-3 yıl ertelemek istiyor. En iyi öneriniz nedir?",
          timeLimit: 35,
          options: [
            { text: "Laktasyonel amenore yöntemi (LAM) yeterli koruma sağlar", correct: false, feedback: "❌ LAM sadece 6 ay süreyle ve sıkı koşullarda güvenilirdir. 2-3 yıl aralık için daha güvenilir bir yöntem gerekli." },
            { text: "RİA veya implant - ikisi de çok etkili, uzun etkili ve emzirme için güvenli", correct: true, feedback: "✓ Mükemmel öneri! Bu uzun etkili yöntemler 3-10 yıl koruma sağlar, hemen geri dönüşümlüdür ve sağlıklı doğum aralığı için mükemmeldir." },
            { text: "Emzirmeyi bırakana kadar kontraseptif kullanmayı bekleyin", correct: false, feedback: "❌ Güvensiz tavsiye. Yumurtlama, emzirme sırasında bile adet görmeden önce geri dönebilir, bu da istenmeyen gebelik riskine yol açar." }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Genç Yetişkin",
      description: "18 yaşında, kontraseptif bilgisi arayan bir genç",
      difficulty: "Zor",
      patient: {
        name: "Zeynep",
        age: "18 yaş",
        background: "Üniversite öğrencisi, ilk kez aile planlaması danışmanlığı alıyor",
        concerns: "Gizlilik, etkinlik ve kullanım kolaylığı"
      },
      dialogues: [
        {
          question: "Zeynep gergin görünüyor ve soruyor: 'Buraya geldiğimi aileme söyler misiniz?'",
          timeLimit: 25,
          options: [
            { text: "Evet, gençsiniz bu yüzden ebeveyn izni gerekli", correct: false, feedback: "❌ Yanlış. 18 yaşında bir kişi yasal olarak yetişkindir ve sağlık kararlarında tam gizlilik hakkı vardır." },
            { text: "Tıbbi bilgileriniz tamamen gizlidir. Yetişkinsiniz ve gizlilik haklarınız var. Bilinçli kararlar vermenize yardımcı olmak için buradayım", correct: true, feedback: "✓ Mükemmel! Güven oluşturdunuz ve hasta özerkliği ile gizliliğe saygı gösterdiniz - üreme sağlığında esastır." },
            { text: "Hangi yöntemi seçtiğinize bağlı", correct: false, feedback: "❌ Yanlış. Gizlilik tedavi seçimlerine bağlı değildir. Tüm yetişkinlerin sağlık kararlarından bağımsız olarak gizlilik hakları vardır." }
          ]
        },
        {
          question: "Cinsel yolla bulaşan enfeksiyonlara karşı koruma hakkında soruyor. Ne tavsiye edersiniz?",
          timeLimit: 30,
          options: [
            { text: "Doğum kontrol hapları hem gebeliğe hem de CYBE'lere karşı korur", correct: false, feedback: "❌ Yanlış ve tehlikeli yanlış bilgi. Hormonal kontraseptifler CYBE'lere karşı korumaz." },
            { text: "Çift koruma önemli: CYBE önleme için prezervatif artı istenirse gebelik önleme için başka bir yöntem kullanın", correct: true, feedback: "✓ Mükemmel! Hem gebelik hem de CYBE önleme hakkında kapsamlı eğitim verdiniz - genç yetişkinler için kritik." },
            { text: "İlişkinizdeyseniz CYBE konusunda endişelenmenize gerek yok", correct: false, feedback: "❌ Yanlış. CYBE riski tüm cinsel ilişkilerde mevcuttur. Hastanın risk seviyesi hakkında asla varsayımda bulunmayın." }
          ]
        }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && timerActive) {
      handleTimeout();
    }
  }, [timeLeft, timerActive]);

  // Level calculation
  useEffect(() => {
    const newLevel = Math.floor(xp / 500) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      if (newLevel === 5) unlockAchievement('level_5');
    }
  }, [xp]);

  const handleTimeout = () => {
    setTimerActive(false);
    setHearts(prev => Math.max(0, prev - 1));
    setStreak(0);
    setComboMultiplier(1);
    setFeedback({
      correct: false,
      feedback: "⏰ Süre doldu! Hızlı düşünmek önemli ama doğru bilgiyi vermek daha önemli.",
      text: "Zaman aşımı"
    });
  };

  const unlockAchievement = (achievementId) => {
    if (!achievements.includes(achievementId)) {
      const achievement = allAchievements.find(a => a.id === achievementId);
      setAchievements(prev => [...prev, achievementId]);
      setShowAchievement(achievement);
      setXp(prev => prev + achievement.xp);
      setTimeout(() => setShowAchievement(null), 3000);
    }
  };

  const startScenario = (scenario) => {
    if (hearts <= 0) {
      alert('❤️ Canınız kalmadı! Oyunu yeniden başlatın.');
      return;
    }
    setCurrentScenario(scenario);
    setCurrentDialogue(0);
    setFeedback(null);
    setGameState('scenario');
    setTimeLeft(scenario.dialogues[0].timeLimit || 30);
    setTimerActive(true);
  };

  const handleAnswer = (option) => {
    setTimerActive(false);
    const timeBonus = timeLeft > 20 ? 25 : 0;
    
    if (option.correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      if (newStreak > bestStreak) setBestStreak(newStreak);
      
      // Combo multiplier
      if (newStreak >= 3) setComboMultiplier(1.5);
      if (newStreak >= 5) setComboMultiplier(2);
      
      const baseXP = 50;
      const streakBonus = newStreak >= 3 ? 30 : 0;
      const totalXP = Math.floor((baseXP + timeBonus + streakBonus) * comboMultiplier);
      
      setXp(prev => prev + totalXP);
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      
      // Achievements
      if (score.correct === 0) unlockAchievement('first_correct');
      if (newStreak === 3) unlockAchievement('streak_3');
      if (newStreak === 5) unlockAchievement('streak_5');
      if (timeLeft > 20) unlockAchievement('speed_demon');
      
    } else {
      setStreak(0);
      setComboMultiplier(1);
      setHearts(prev => Math.max(0, prev - 1));
      setScore(prev => ({ correct: prev.correct, total: prev.total + 1 }));
    }
    
    setFeedback({ ...option, timeBonus, streakBonus: streak >= 3 ? 30 : 0 });
  };

  const nextDialogue = () => {
    if (currentDialogue < currentScenario.dialogues.length - 1) {
      setCurrentDialogue(prev => prev + 1);
      setFeedback(null);
      const nextTimeLimit = currentScenario.dialogues[currentDialogue + 1].timeLimit || 30;
      setTimeLeft(nextTimeLimit);
      setTimerActive(true);
    } else {
      completeScenario();
    }
  };

  const completeScenario = () => {
    const scenarioQuestions = currentScenario.dialogues.length;
    const scenarioCorrect = score.correct - (score.total - scenarioQuestions);
    
    if (scenarioCorrect === scenarioQuestions) {
      unlockAchievement('perfect_scenario');
    }
    
    setCompletedScenarios(prev => [...prev, currentScenario.id]);
    setXp(prev => prev + 150);
    
    if (completedScenarios.length + 1 === scenarios.length) {
      unlockAchievement('all_scenarios');
    }
    
    setGameState('complete');
  };

  const backToMenu = () => {
    setGameState('menu');
    setCurrentScenario(null);
    setCurrentDialogue(0);
    setFeedback(null);
    setTimerActive(false);
  };

  const resetGame = () => {
    setXp(0);
    setLevel(1);
    setHearts(3);
    setCompletedScenarios([]);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
    setBestStreak(0);
    setAchievements([]);
    setGameState('menu');
  };

  const renderMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 md:p-8 mb-6 border-4 border-yellow-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center gap-3 justify-center md:justify-start">
                <Heart className="text-red-300 animate-pulse" size={40} />
                Sağlıklı Gelecek
              </h1>
              <p className="text-pink-100 text-lg md:text-xl font-semibold">Aile Planlaması Kliniği</p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center border-2 border-yellow-300">
                <Trophy className="text-yellow-300 mx-auto mb-1" size={32} />
                <div className="text-2xl font-bold text-white">{level}</div>
                <div className="text-xs text-pink-100">Seviye</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center border-2 border-green-300">
                <Zap className="text-green-300 mx-auto mb-1" size={32} />
                <div className="text-2xl font-bold text-white">{xp}</div>
                <div className="text-xs text-pink-100">XP</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center border-2 border-red-300">
                <div className="flex gap-1 justify-center mb-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      size={20}
                      className={i < hearts ? "fill-red-400 text-red-400" : "text-gray-400"}
                    />
                  ))}
                </div>
                <div className="text-xs text-pink-100">Can</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-white mb-1">
              <span>Seviye {level}</span>
              <span>{xp % 500}/500 XP</span>
            </div>
            <div className="w-full bg-purple-900 rounded-full h-4 overflow-hidden border-2 border-yellow-300">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-500"
                style={{width: `${(xp % 500) / 5}%`}}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl shadow-lg border-2 border-white/30">
            <Target className="text-white mb-2" size={24} />
            <div className="text-2xl font-bold text-white">{score.correct}/{score.total}</div>
            <div className="text-xs text-blue-100">Doğru Cevap</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-xl shadow-lg border-2 border-white/30">
            <Zap className="text-white mb-2" size={24} />
            <div className="text-2xl font-bold text-white">{streak}</div>
            <div className="text-xs text-orange-100">Seri</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl shadow-lg border-2 border-white/30">
            <TrendingUp className="text-white mb-2" size={24} />
            <div className="text-2xl font-bold text-white">{bestStreak}</div>
            <div className="text-xs text-green-100">En İyi Seri</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl shadow-lg border-2 border-white/30">
            <Award className="text-white mb-2" size={24} />
            <div className="text-2xl font-bold text-white">{achievements.length}/{allAchievements.length}</div>
            <div className="text-xs text-purple-100">Başarım</div>
          </div>
        </div>

        {/* Victory */}
        {completedScenarios.length === scenarios.length && hearts > 0 && (
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 border-4 border-yellow-200 rounded-2xl p-6 mb-6 text-center animate-pulse">
            <Trophy className="mx-auto mb-3 text-white" size={64} />
            <h2 className="text-3xl font-bold text-white mb-2">🎉 TEBRİKLER! 🎉</h2>
            <p className="text-white font-bold text-xl mb-2">Aile Planlaması Uzmanı Sertifikası Kazandınız!</p>
            <p className="text-white/90 mb-4">Skor: {score.correct}/{score.total} | En İyi Seri: {bestStreak}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-white text-orange-600 rounded-xl hover:bg-yellow-100 font-bold text-lg shadow-lg"
            >
              🔄 Yeni Oyun Başlat
            </button>
          </div>
        )}

        {/* Scenarios */}
        <div className="grid md:grid-cols-3 gap-6">
          {scenarios.map(scenario => {
            const isCompleted = completedScenarios.includes(scenario.id);
            const difficultyColor = scenario.difficulty === 'Kolay' ? 'green' : scenario.difficulty === 'Orta' ? 'yellow' : 'red';
            
            return (
              <div key={scenario.id} className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:scale-105 transition-transform border-4 border-purple-300">
                <div className={`bg-gradient-to-br ${
                  scenario.difficulty === 'Kolay' ? 'from-green-500 to-emerald-600' :
                  scenario.difficulty === 'Orta' ? 'from-yellow-500 to-orange-600' :
                  'from-red-500 to-pink-600'
                } p-6 text-white relative`}>
                  {isCompleted && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="text-green-300" size={32} />
                    </div>
                  )}
                  <Users size={40} className="mb-3" />
                  <div className={`inline-block px-3 py-1 bg-${difficultyColor}-900/50 rounded-full text-xs font-bold mb-2`}>
                    {scenario.difficulty}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{scenario.title}</h3>
                  <p className="text-sm opacity-90">{scenario.description}</p>
                </div>
                <div className="p-6">
                  <div className="space-y-2 mb-4 text-sm text-gray-700">
                    <p><strong>👤 Hasta:</strong> {scenario.patient.name}</p>
                    <p><strong>📅 Yaş:</strong> {scenario.patient.age}</p>
                    <p className="text-xs text-gray-600">{scenario.patient.background}</p>
                  </div>
                  <button
                    onClick={() => startScenario(scenario)}
                    disabled={hearts <= 0}
                    className={`w-full ${hearts <= 0 ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'} text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg`}
                  >
                    {isCompleted ? '🔄 Tekrar Oyna' : '▶️ Başlat'}
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Game Over */}
        {hearts <= 0 && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 p-8 rounded-2xl text-center max-w-md border-4 border-white">
              <XCircle className="mx-auto mb-4 text-white" size={80} />
              <h2 className="text-4xl font-bold text-white mb-4">Oyun Bitti!</h2>
              <p className="text-white mb-6">Tüm canlarınızı kaybettiniz. Ancak endişelenmeyin, öğrenmek denemekten geçer!</p>
              <div className="bg-white/20 rounded-lg p-4 mb-6 text-white">
                <p className="font-bold">Toplam XP: {xp}</p>
                <p>Doğru Cevaplar: {score.correct}/{score.total}</p>
                <p>En İyi Seri: {bestStreak}</p>
              </div>
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-white text-red-600 rounded-xl hover:bg-gray-100 font-bold text-lg shadow-lg"
              >
                🔄 Tekrar Dene
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Achievement Popup */}
      {showAchievement && (
        <div className="fixed top-20 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl shadow-2xl border-4 border-yellow-200 animate-bounce z-50">
          <div className="flex items-center gap-3">
            <Award className="text-white" size={32} />
            <div>
              <div className="font-bold text-white">{showAchievement.title}</div>
              <div className="text-sm text-white/90">{showAchievement.desc}</div>
              <div className="text-xs text-yellow-900 font-bold">+{showAchievement.xp} XP</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderScenario = () => {
    const dialogue = currentScenario.dialogues[currentDialogue];
    const timePercentage = (timeLeft / dialogue.timeLimit) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-400">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{currentScenario.title}</h2>
                  <p className="text-purple-100">Soru {currentDialogue + 1}/{currentScenario.dialogues.length}</p>
                </div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Heart
                      key={i}
                      size={24}
                      className={i < hearts ? "fill-red-300 text-red-300" : "text-purple-300"}
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="bg-white/20 backdrop-blur rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="text-white" size={20} />
                    <span className="font-bold text-xl">{timeLeft}s</span>
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-2 bg-orange-500 px-3 py-1 rounded-full">
                      <Zap size={16} />
                      <span className="font-bold text-sm">{streak}x Seri!</span>
                    </div>
                  )}
                </div>
                <div className="w-full bg-purple-900 rounded-full h-3 overflow-hidden border-2 border-white">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      timePercentage > 50 ? 'bg-green-500' :
                      timePercentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{width: `${timePercentage}%`}}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Question */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-inner">
                <div className="flex items-start gap-3">
                  <MessageSquare className="text-blue-600 flex-shrink-0 mt-1" size={28} />
                  <div>
                    <p className="font-bold text-blue-900 mb-2">Hasta diyor ki:</p>
                    <p className="text-gray-800 text-lg">{dialogue.question}</p>
                  </div>
                </div>
              </div>

              {!feedback ? (
                <div className="space-y-4">
                  <p className="font-bold text-gray-700 mb-4 text-lg">Cevabınızı seçin:</p>
                  {dialogue.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left p-4 bg-gradient-to-r from-white to-purple-50 border-3 border-purple-300 rounded-xl hover:border-pink-500 hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      <p className="text-gray-800 font-medium">{option.text}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl shadow-lg ${feedback.correct ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-500' : 'bg-gradient-to-r from-red-100 to-pink-100 border-4 border-red-500'}`}>
                    <div className="flex items-start gap-3 mb-3">
                      {feedback.correct ? (
                        <CheckCircle className="text-green-600 flex-shrink-0 animate-bounce" size={36} />
                      ) : (
                        <XCircle className="text-red-600 flex-shrink-0" size={36} />
                      )}
                      <div className="flex-1">
                        <h3 className={`text-2xl font-bold mb-3 ${feedback.correct ? 'text-green-900' : 'text-red-900'}`}>
                          {feedback.correct ? '🎯 Harika Cevap!' : '❌ Doğru Değil'}
                        </h3>
                        <p className={`text-lg ${feedback.correct ? 'text-green-800' : 'text-red-800'}`}>
                          {feedback.feedback}
                        </p>
                      </div>
                    </div>
                    
                    {feedback.correct && (
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-green-200 p-3 rounded-lg text-center">
                          <Star className="mx-auto mb-1 text-green-700" size={24} />
                          <div className="font-bold text-green-900">+50 XP</div>
                          <div className="text-xs text-green-700">Temel Puan</div>
                        </div>
                        {feedback.timeBonus > 0 && (
                          <div className="bg-blue-200 p-3 rounded-lg text-center">
                            <Zap className="mx-auto mb-1 text-blue-700" size={24} />
                            <div className="font-bold text-blue-900">+{feedback.timeBonus} XP</div>
                            <div className="text-xs text-blue-700">Hız Bonusu</div>
                          </div>
                        )}
                        {feedback.streakBonus > 0 && (
                          <div className="bg-orange-200 p-3 rounded-lg text-center">
                            <Trophy className="mx-auto mb-1 text-orange-700" size={24} />
                            <div className="font-bold text-orange-900">+{feedback.streakBonus} XP</div>
                            <div className="text-xs text-orange-700">Seri Bonusu</div>
                          </div>
                        )}
                        {comboMultiplier > 1 && (
                          <div className="bg-purple-200 p-3 rounded-lg text-center">
                            <Zap className="mx-auto mb-1 text-purple-700" size={24} />
                            <div className="font-bold text-purple-900">x{comboMultiplier}</div>
                            <div className="text-xs text-purple-700">Çarpan</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={nextDialogue}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
                  >
                    {currentDialogue < currentScenario.dialogues.length - 1 ? '➡️ Sonraki Soru' : '✅ Senaryoyu Tamamla'}
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={backToMenu}
            className="mt-6 px-6 py-3 bg-white/20 backdrop-blur text-white rounded-xl hover:bg-white/30 font-bold border-2 border-white/30"
          >
            ← Ana Menüye Dön
          </button>
        </div>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 flex items-center justify-center">
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl p-12 max-w-2xl text-center border-4 border-yellow-400">
        <div className="relative">
          <Trophy className="mx-auto mb-4 text-yellow-500 animate-bounce" size={80} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Star className="text-yellow-300 animate-spin" size={40} style={{animationDuration: '3s'}} />
          </div>
        </div>
        <h2 className="text-4xl font-bold text-purple-900 mb-4">Senaryo Tamamlandı!</h2>
        <p className="text-gray-700 text-lg mb-6">{currentScenario.title} danışmanlık seansını başarıyla tamamladınız!</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
            <Award size={40} className="mx-auto mb-2" />
            <p className="text-3xl font-bold mb-1">+150</p>
            <p className="text-sm">Tamamlama Bonusu</p>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 text-white shadow-lg">
            <Star size={40} className="mx-auto mb-2" />
            <p className="text-3xl font-bold mb-1">{xp}</p>
            <p className="text-sm">Toplam XP</p>
          </div>
        </div>

        <div className="bg-purple-100 border-2 border-purple-400 rounded-xl p-4 mb-6">
          <p className="text-purple-900 font-semibold">Tamamlanan Senaryolar: {completedScenarios.length}/{scenarios.length}</p>
          <p className="text-purple-700 text-sm mt-1">En İyi Seri: {bestStreak}</p>
        </div>

        <button
          onClick={backToMenu}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg transform hover:scale-105"
        >
          🏥 Kliniğe Dön
        </button>
      </div>
    </div>
  );

  return (
    <>
      {gameState === 'menu' && renderMenu()}
      {gameState === 'scenario' && renderScenario()}
      {gameState === 'complete' && renderComplete()}
    </>
  );
};

export default FamilyPlanningGame;