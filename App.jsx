import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, Copy, Users, BarChart3, MessageSquare, Star, Share2, ArrowLeft, LogOut } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, set, onValue, update, remove } from 'firebase/database';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBXCYn5oXHxM4oM3r7NAqDVtL2rUTTdCjA",
  authDomain: "game4couple-b866c.firebaseapp.com",
  databaseURL: "https://game4couple-b866c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "game4couple-b866c",
  storageBucket: "game4couple-b866c.appspot.com",
  messagingSenderId: "726483215600",
  appId: "1:726483215600:web:9139b9523d4149d861ce35",
  measurementId: "G-7306TE5K93"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const CoupleGameOnline = () => {
  const [screen, setScreen] = useState('menu');
  const [playerName, setPlayerName] = useState('');
  const [gameRoomId, setGameRoomId] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [otherPlayer, setOtherPlayer] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [category, setCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [myResponse, setMyResponse] = useState('');
  const [otherResponse, setOtherResponse] = useState('');
  const [gameHistory, setGameHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [suggestedAnswers, setSuggestedAnswers] = useState(['', '', '', '', '']);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  const defaultQuestions = {
    personal: [
      { q: "Jaki jest twój ulubiony kolor?", type: "choice", options: ["Czerwony", "Niebieski", "Zielony", "Fioletowy", "Czarny"] },
      { q: "Jaka muzyka cię porusza?", type: "choice", options: ["Rock", "Pop", "Jazz", "Klasyka", "Hip-hop"] },
      { q: "Jaką cechę charakteru najbardziej lubisz we mnie?", type: "text" },
      { q: "Kiedy po raz pierwszy pomyślałaś/pomyślałeś, że jestem specjalny/a?", type: "text" },
      { q: "Jaka jest twoja największa marzenie?", type: "text" },
      { q: "Jaki sport cię bawi?", type: "choice", options: ["Piłka nożna", "Tenis", "Pływanie", "Jogowanie", "Joga"] },
      { q: "Wybierz styl mody:", type: "choice", options: ["Casualowy", "Elegancki", "Sportowy", "Artystyczny", "Grunge"] },
      { q: "Co byś robił/a gdybyś miał/a wolny dzień?", type: "text" },
      { q: "Jaka jest twoja największa słabość?", type: "text" },
      { q: "Gdzie widzisz nas za 5 lat?", type: "text" },
      { q: "Jakie jest twoje ulubione wspomnienie ze mną?", type: "text" },
      { q: "Co cię w życiu najbardziej inspire?", type: "text" },
      { q: "Jakby mogła/mógł zmienić jedną rzecz w sobie, co byś zmienił/a?", type: "text" },
      { q: "Jaki jest twój ulubiony zapach?", type: "text" },
      { q: "Którą porę roku lubisz najbardziej?", type: "choice", options: ["Wiosna", "Lato", "Jesień", "Zima"] },
      { q: "Co cię sprawiła/sprawił szczęśliwy/a dziś?", type: "text" },
      { q: "Jaki film/serial cię ostatnio poruszył/a?", type: "text" },
      { q: "Jakie masz sekrety?", type: "text" },
      { q: "Co chciałabym/chciałbym powiedzieć, ale się boisz?", type: "text" },
      { q: "Jaka jest twoja największa fantazja?", type: "text" },
      { q: "Czy kiedyś byłaś/byłeś zazdrosny/a? O co?", type: "text" },
      { q: "Co cię najbardziej pociąga we mnie fizycznie?", type: "text" },
      { q: "Jakie miejsce uważasz za najromantyczniejsze?", type: "text" },
      { q: "Kiedy czujesz się najbardziej seksowny/a?", type: "text" },
      { q: "Jaka jest twoja ulubiona poza?", type: "text" },
      { q: "Czy jesteś zadowolony/a z naszego życia intymnego?", type: "choice", options: ["Tak", "Mogłoby być więcej", "Chciałbym zmian", "Idealnie"] },
      { q: "O czym myślisz w najprivate'owych chwilach?", type: "text" },
      { q: "Jaka jest twoja ulubiona godzina dnia na spotkanie intymne?", type: "choice", options: ["Rano", "W południe", "Wieczorem", "W nocy", "Bez znaczenia"] },
      { q: "Czy masz jakąś fantazję, którą chciałbyś/chciałabyś spełnić?", type: "text" },
      { q: "Co cię wkurza w naszym związku?", type: "text" },
      { q: "Jakie są twoje obawy o przyszłość?", type: "text" },
      { q: "Co zrobiłbyś/zrobiłabyś aby ratować nasz związek?", type: "text" },
      { q: "Czy kiedyś miałaś/miałeś uczucia do kogoś innego?", type: "text" },
      { q: "Co cię zastanawia o mnie?", type: "text" },
      { q: "Czy jesteś szczęśliwy/a?", type: "choice", options: ["Tak", "Nieraz", "Czasami", "Nie wiem"] },
      { q: "Jaka jest twoja największa insecurities?", type: "text" },
      { q: "Co byśmy mogli zrobić aby być bliżej siebie?", type: "text" },
      { q: "Czy jesteś w pełni szczery/a ze mną?", type: "choice", options: ["Tak", "Prawie", "Nie zawsze", "Nie"] },
      { q: "Co zawsze chciałaś/chciałeś mi powiedzieć?", type: "text" },
      { q: "Jaka jest twoja ulubiona rzecz do robienia ze mną?", type: "text" },
      { q: "Czy chciałbyś/chciałabyś aby coś się zmieniło?", type: "text" },
      { q: "Jak się czujesz wobec przyszłości naszego związku?", type: "text" },
      { q: "Co robisz kiedy jest mi smutno?", type: "text" },
      { q: "Czy mam jakieś nawyki które cię irytują?", type: "text" },
      { q: "Jaka jest najlepsza rzecz w byciu razem?", type: "text" },
      { q: "Co chciałbyś wymienić we mnie?", type: "text" },
      { q: "Czy kiedyś myślałaś/myślałeś o rozstaniu?", type: "choice", options: ["Nigdy", "Raz czy dwa", "Czasami", "Często"] },
    ],
    funny: [
      { q: "🦃 Jaka część twojego ciała jest największa?", suggested: ["Ego", "Nos", "Uszy", "Ambicja", "Duma"] },
      { q: "😂 Co byś zrobił/a gdybyś się obudził/a jako ptak?", suggested: ["Latałbym nad ex'ami", "Bym srał na wszystko", "Odkryłbym nowy sens", "Bym żył/a bez walki"] },
      { q: "🤡 Która część twojego dnia to czysta komedia?", suggested: ["Randkowe próby", "Rozmowy z siebie", "Poranne przeglądanie", "Całe życie"] },
      { q: "🎭 Jaki byś być celebrytą?", suggested: ["Z memów", "Gorszych tańców", "Najlepszych downów", "Z niczego"] },
      { q: "🍕 Czy pizza może być desererem?", suggested: ["Jasne", "Nigdy", "Czemu nie", "Już jest"] },
      { q: "👻 Co byś zrobił/a gdybyś zobaczył/a ducha?", suggested: ["Zapraszam na kawę", "Uciekam piszcząc", "Pytam porady", "Robię zdjęcie"] },
      { q: "🚀 Na którą planetę byś się przeprowadził/a?", suggested: ["Mars", "Wenus", "Saturn", "Pluton"] },
      { q: "🦖 Jakie zwierzę byś chciał/a być?", suggested: ["Smok", "Flamingo", "Tygrys", "Kat"] },
      { q: "🎪 Jaki talent byś chciał/a mieć?", suggested: ["Czytać myśli", "Latać", "Teleportować", "Być niewidoczny"] },
      { q: "🏆 Co byś wygrał/a medal za?", suggested: ["Jedzenie", "Spanie", "Bycie slow", "Nic"] },
      { q: "🎸 Jaki byś instrument być?", suggested: ["Gitara", "Fortepian", "Trąbka", "Perkusja"] },
      { q: "🌮 Jaki byś kuchni być?", suggested: ["Włoska", "Meksykańska", "Azjatycka", "Śmieciowa"] },
      { q: "🦸 Jaki byś superpower chciał/a mieć?", suggested: ["Freeze czasu", "Niewidoczność", "Latać", "Czytać myśli"] },
      { q: "🎬 Jaki film byś gwiazdą być?", suggested: ["Horror", "Komedia", "Akcja", "Romans"] },
      { q: "🧟 Jak byś się zachował w apokalipsie zombie?", suggested: ["Pierwsza ofiara", "Bohater", "Się ukrywam", "Dowodzę"] },
      { q: "🍰 Jaki byś tort być?", suggested: ["Czekoladowy", "Truskawkowy", "Pijany", "Koszmar"] },
      { q: "🎮 Jaki byś w grze być?", suggested: ["Boss", "Main char", "NPC", "Easter egg"] },
      { q: "🌈 Jaki byś kolor być?", suggested: ["Tęcza", "Czarny", "Neon", "Przezroczysty"] },
      { q: "🔥 Co byś robił bez internetu?", suggested: ["Czytał/a", "Wariował/a", "Ludzi poznawał", "Umierał/a"] },
      { q: "💎 Jaki byś klejnot być?", suggested: ["Diament", "Szmaragd", "Rubin", "Topaz"] },
    ],
    spicy: [
      { q: "🔥 Jaka pozycja jest twoją ulubioną?", type: "text" },
      { q: "💋 Jaki pocałunek cię najbardziej pociąga?", type: "text" },
      { q: "🌶️ Co chciałbyś/chciałabyś, aby zrobił/a ci mnie?", type: "text" },
      { q: "👅 Gdzie lubisz być dotykany/a?", type: "text" },
      { q: "🔞 Jaka jest twoja najintymniejsza fantazja?", type: "text" },
      { q: "🎯 Jakie jest miejsce które cię najbardziej pociąga?", type: "text" },
      { q: "😈 Czego nigdy byś nie zrobił/a w łóżku?", type: "text" },
      { q: "💦 Co byś chciał/a próbować?", type: "text" },
      { q: "🌙 Jaka byla najlepsza noc z tobą?", type: "text" },
      { q: "👀 Co byś zrobił/a gdybyśmy byli sami?", type: "text" },
      { q: "🔥 Czy kiedy myślisz o mnie, stajesz/staje się podekscytowany/a?", type: "choice", options: ["Zawsze", "Czasami", "Rzadko", "Nigdy"] },
      { q: "💋 Jakie słowa sprawiają ci przyjemność?", type: "text" },
      { q: "🌶️ Jaka część mojego ciała cię najbardziej pociąga?", type: "text" },
      { q: "👅 Co byś zrobił/a gdybyśmy mieli całą noc sami?", type: "text" },
      { q: "🎭 Czy lubisz grać role?", type: "choice", options: ["Kocham", "Mogę", "Nie wiem", "Nie"] },
      { q: "🔞 Jaka jest twoja granica?", type: "text" },
      { q: "💦 Jaki jest twój ulubiony seks?", suggested: ["Powolny", "Dziki", "Playful", "Eksperymentalny"] },
      { q: "😈 Czy byś chciał/a widźców?", type: "choice", options: ["Tak", "Może", "Nie", "Chyba nie"] },
      { q: "🌙 Co byś zrobił/a w publicznym miejscu?", type: "text" },
      { q: "🔥 Jaki scenariusz byś chciał/a zagrać?", type: "text" },
      { q: "💋 Jaki zapach cię pociąga?", type: "text" },
      { q: "👀 Co widzisz myśląc o mnie?", type: "text" },
      { q: "🌶️ Czy chciałbyś/chciałabyś eksperymentować?", type: "choice", options: ["Tak", "Może", "Nie", "Nie"] },
      { q: "🎯 Jakie są granice?", type: "text" },
      { q: "👅 Jaka część mnie ciebie ekscytuje?", type: "text" },
      { q: "🔞 Czy kiedyś fantazjowałeś/fantazjowałaś o kimś innym?", type: "text" },
      { q: "💦 Co byś zrobił/a w idealnym scenariuszu?", type: "text" },
      { q: "😈 Czy lubisz prowadzić czy być prowadzony/a?", type: "choice", options: ["Prowadzić", "Być prowadzony", "Nie ma roli", "Zależy"] },
      { q: "🌙 Jaka jest seksualnie twoja eksytującą rzeczą?", type: "text" },
      { q: "🔥 Co byś zrobił/a bez ograniczeń?", type: "text" },
    ],
    challenge: [
      { q: "🎬 Spróbuj naśladować mnie przez 1 minutę", type: "challenge" },
      { q: "📸 Zrób selfie w najśmieszniejszej pozycji", type: "challenge" },
      { q: "🎤 Zaśpiewaj piosenkę miłosną na żywo", type: "challenge" },
      { q: "💃 Zatańcz seksownie dla mnie", type: "challenge" },
      { q: "🎭 Zagraj scenę z filmu o miłości", type: "challenge" },
      { q: "📱 Pokaż mi 5 ostatnich zdjęć z telefonu", type: "challenge" },
      { q: "🎵 Zaśpiewaj naszą ulubioną piosenkę", type: "challenge" },
      { q: "🤳 Zrób selfie w najbardziej seksownym wyglądzie", type: "challenge" },
      { q: "💌 Napisz mi wiadomość miłosną", type: "challenge" },
      { q: "🎪 Zrób coś, co sprawia mi zawsze radość", type: "challenge" },
      { q: "🔥 Dotykaj siebie podczas gdy ja obserwuję", type: "challenge" },
      { q: "👅 Pocałuj mnie przez 30 sekund bez przerwy", type: "challenge" },
      { q: "💋 Pocałuj każdą moją zmysłową część", type: "challenge" },
      { q: "😈 Powiedz mi 3 rzeczy które lubisz we mnie", type: "challenge" },
      { q: "🎯 Zrób mi masaż", type: "challenge" },
      { q: "🌶️ Daj mi znak seksownie", type: "challenge" },
      { q: "🔞 Powiedz mi najtajniejszą fantazję", type: "challenge" },
      { q: "💦 Spędź 5 minut dotykając mnie gdzie chcesz", type: "challenge" },
      { q: "😈 Bądź niegrzeczny/a", type: "challenge" },
      { q: "🌙 Spójrz w moje oczy i powiedz co czujesz", type: "challenge" },
      { q: "🔥 Pokaz mi co chciałbyś zrobić", type: "challenge" },
    ]
  };

  // Generuj unikalny kod pokoju
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Stwórz nową grę
  const createNewGame = (name, selectedCategory) => {
    const roomId = generateRoomCode();
    const gameRef = ref(db, `games/${roomId}`);
    
    set(gameRef, {
      player1: {
        name: name,
        joinedAt: new Date().toISOString(),
        status: 'waiting'
      },
      category: selectedCategory,
      roomId: roomId,
      createdAt: new Date().toISOString(),
      status: 'waiting_for_player2',
      questions: defaultQuestions[selectedCategory],
      currentQuestionIndex: 0,
      responses: [],
      stats: {
        questionsAnswered: 0,
        startTime: new Date().toISOString(),
        endTime: null
      }
    });

    setGameRoomId(roomId);
    setCurrentPlayer({ name: name, role: 'player1' });
    setScreen('waiting_for_player');
  };

  // Dołącz do istniejącej gry
  const joinGame = (roomId, name) => {
    const gameRef = ref(db, `games/${roomId}`);
    update(gameRef, {
      'player2.name': name,
      'player2.joinedAt': new Date().toISOString(),
      status: 'in_progress'
    });
    
    setGameRoomId(roomId);
    setCurrentPlayer({ name: name, role: 'player2' });
    setScreen('game');
  };

  // Nasłuchuj zmiany w grze
  useEffect(() => {
    if (!gameRoomId) return;

    const gameRef = ref(db, `games/${gameRoomId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setGameData(data);

        if (currentPlayer?.role === 'player1') {
          setOtherPlayer(data.player2);
        } else if (currentPlayer?.role === 'player2') {
          setOtherPlayer(data.player1);
        }

        if (data.currentQuestionIndex < data.questions.length) {
          setCurrentQuestion({
            ...data.questions[data.currentQuestionIndex],
            index: data.currentQuestionIndex
          });
        }

        if (data.responses && data.responses.length > 0) {
          const lastResponse = data.responses[data.responses.length - 1];
          if (lastResponse.answeredBy !== currentPlayer?.role) {
            setOtherResponse(lastResponse.answer);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [gameRoomId, currentPlayer]);

  // Wyślij odpowiedź
  const submitResponse = (answer) => {
    if (!gameData || !currentPlayer) return;

    const responsesRef = ref(db, `games/${gameRoomId}/responses`);
    const newResponseRef = push(responsesRef);

    set(newResponseRef, {
      questionIndex: gameData.currentQuestionIndex,
      question: currentQuestion.q,
      answer: answer,
      answeredBy: currentPlayer.role,
      answeredByName: currentPlayer.name,
      timestamp: new Date().toISOString(),
      rating: 0,
      comments: []
    });

    // Przejdź do następnego pytania
    const newIndex = gameData.currentQuestionIndex + 1;
    const gameRef = ref(db, `games/${gameRoomId}`);
    update(gameRef, {
      currentQuestionIndex: newIndex,
      'stats.questionsAnswered': gameData.stats.questionsAnswered + 1
    });

    setMyResponse('');
  };

  // Dodaj ocenę
  const addRating = (responseKey, ratingValue) => {
    const ratingRef = ref(db, `games/${gameRoomId}/responses/${responseKey}/rating`);
    set(ratingRef, ratingValue);
  };

  // Dodaj komentarz
  const addComment = (responseKey, comment) => {
    const commentsRef = ref(db, `games/${gameRoomId}/responses/${responseKey}/comments`);
    const newCommentRef = push(commentsRef);
    
    set(newCommentRef, {
      author: currentPlayer.name,
      text: comment,
      timestamp: new Date().toISOString()
    });
  };

  // Skopiuj link
  const copyLink = () => {
    const link = `${window.location.origin}?room=${gameRoomId}`;
    navigator.clipboard.writeText(link);
    alert('Link skopiowany! 📋');
  };

  // Ekran menu głównego
  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-emerald-950 flex items-center justify-center p-4">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');
          .glow-text { text-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(59, 130, 246, 0.3); }
        `}</style>
        
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-400 glow-text">
            💚💙 Gra Online 💙💚
          </h1>
          <p className="text-xl text-gray-300 mb-12">Zaproś partnera i graj online!</p>

          <div className="space-y-4 mb-8">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Wpisz swoje imię"
              className="w-full bg-gray-800 text-white border-2 border-emerald-500/50 rounded-xl p-4 focus:outline-none focus:border-emerald-400"
            />

            <button
              onClick={() => {
                if (playerName.trim()) {
                  setScreen('choose_action');
                }
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl text-lg transition transform hover:scale-105"
            >
              Dalej →
            </button>
          </div>

          <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/30 text-gray-300">
            <p className="text-sm">💡 Gra wymaga 2 graczy - jeden stworzy grę, drugi dołączy do niej poprzez unikalny link!</p>
          </div>
        </div>
      </div>
    );
  }

  // Ekran wyboru akcji
  if (screen === 'choose_action') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-emerald-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <button onClick={() => setScreen('menu')} className="text-emerald-400 mb-6 flex items-center gap-2">
            ← Powrót
          </button>

          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            Co chcesz zrobić?
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => setScreen('select_category')}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold py-6 px-6 rounded-xl text-lg transition"
            >
              🎮 Stwórz nową grę
            </button>

            <button
              onClick={() => setScreen('join_game')}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold py-6 px-6 rounded-xl text-lg transition"
            >
              🔗 Dołącz do gry
            </button>

            <button
              onClick={() => setScreen('history')}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-bold py-6 px-6 rounded-xl text-lg transition flex items-center justify-center gap-2"
            >
              <BarChart3 size={24} /> Historia gier
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ekran wyboru kategorii
  if (screen === 'select_category') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-emerald-950 p-4">
        <button onClick={() => setScreen('choose_action')} className="text-emerald-400 mb-6 flex items-center gap-2">
          ← Powrót
        </button>

        <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
          Wybierz kategorię 🎮
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'personal', emoji: '💭', title: 'Osobiste', desc: 'Poznaj się głębiej' },
            { name: 'funny', emoji: '😂', title: 'Śmieszne', desc: 'Śmiejcie się razem' },
            { name: 'spicy', emoji: '🔥', title: 'SPICY', desc: 'Podkręć temperaturę' },
            { name: 'challenge', emoji: '🎯', title: 'Wyzwanie', desc: 'Zrób coś!' }
          ].map(cat => (
            <button
              key={cat.name}
              onClick={() => {
                createNewGame(playerName, cat.name);
                setCategory(cat.name);
              }}
              className="bg-gradient-to-br from-blue-900/50 to-emerald-900/50 border-2 border-emerald-500/50 hover:border-emerald-400 p-6 rounded-xl text-left transition transform hover:scale-105"
            >
              <div className="text-5xl mb-3">{cat.emoji}</div>
              <h3 className="text-2xl font-bold text-emerald-300 mb-2">{cat.title}</h3>
              <p className="text-gray-300">{cat.desc}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Ekran czekania na drugiego gracza
  if (screen === 'waiting_for_player') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-emerald-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            ⏳ Czekamy na drugiego gracza...
          </h2>

          <div className="bg-blue-900/30 border-2 border-blue-500/50 rounded-xl p-8 mb-8">
            <p className="text-gray-300 mb-4">Kod pokoju:</p>
            <div className="bg-black/40 rounded-lg p-4 text-2xl font-bold text-emerald-300 mb-6">
              {gameRoomId}
            </div>

            <button
              onClick={copyLink}
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Copy size={20} /> Skopiuj link zaproszenia
            </button>

            <p className="text-gray-400 text-sm mt-4">Wyślij ten kod swojemu partnerowi!</p>
          </div>

          <button
            onClick={() => setScreen('choose_action')}
            className="text-gray-400 hover:text-gray-300 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} /> Anuluj
          </button>
        </div>
      </div>
    );
  }

  // Ekran dołączenia do gry
  if (screen === 'join_game') {
    const [joinCode, setJoinCode] = useState('');

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-emerald-950 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <button onClick={() => setScreen('choose_action')} className="text-emerald-400 mb-6 flex items-center gap-2">
            ← Powrót
          </button>

          <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
            Dołącz do gry 🔗
          </h2>

          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Wpisz kod pokoju (np. ABC123)"
            className="w-full bg-gray-800 text-white border-2 border-emerald-500/50 rounded-xl p-4 mb-6 focus:outline-none focus:border-emerald-400 text-center text-2xl font-bold"
          />

          <button
            onClick={() => {
              if (joinCode.trim().length === 6) {
                joinGame(joinCode, playerName);
              } else {
                alert('Kod musi mieć 6 znaków!');
              }
            }}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl text-lg transition"
          >
            Dołącz →
          </button>
        </div>
      </div>
    );
  }

  // Ekran gry
  if (screen === 'game' && gameData && currentQuestion) {
    const isMyTurn = gameData.stats.questionsAnswered % 2 === 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-emerald-950 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => {
                if (window.confirm('Czy na pewno chcesz opuścić grę?')) {
                  setScreen('choose_action');
                  setGameRoomId('');
                }
              }}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-2"
            >
              <LogOut size={20} /> Wyjdź
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-400">Tura gracza:</p>
              <p className="text-xl font-bold text-emerald-300">
                {isMyTurn ? `${currentPlayer.name} 👤` : `${otherPlayer?.name} 👤`}
              </p>
            </div>

            <button
              onClick={() => setShowStats(!showStats)}
              className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2"
            >
              <BarChart3 size={20} /> Statystyki
            </button>
          </div>

          {/* Gracze online */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-900/30 border border-emerald-500 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">Gracz 1</p>
              <p className="text-lg font-bold text-emerald-300">{gameData.player1?.name} ✅</p>
            </div>
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">Gracz 2</p>
              <p className="text-lg font-bold text-blue-300">{otherPlayer?.name || '⏳'}</p>
            </div>
          </div>

          {/* Pytanie */}
          <div className="bg-gradient-to-br from-emerald-900/50 to-blue-900/50 border-2 border-emerald-500/50 rounded-2xl p-8 mb-8">
            <h3 className="text-3xl font-bold text-emerald-300 text-center mb-6">
              {currentQuestion.q}
            </h3>

            {/* Odpowiedzi sugerowane */}
            {currentQuestion.suggested && (
              <div className="mb-6">
                <p className="text-gray-300 font-bold mb-3">💡 Sugerowane odpowiedzi:</p>
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.suggested.map((sugg, idx) => (
                    <button
                      key={idx}
                      onClick={() => submitResponse(sugg)}
                      className="bg-emerald-600/50 border border-emerald-500 rounded-lg p-3 text-emerald-100 hover:bg-emerald-600 transition"
                    >
                      {sugg}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Opcje wielokrotnego wyboru */}
            {currentQuestion.options && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => submitResponse(option)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Pole tekstowe */}
            {(currentQuestion.type === 'text' || !currentQuestion.type || currentQuestion.type === 'challenge') && (
              <>
                <textarea
                  value={myResponse}
                  onChange={(e) => setMyResponse(e.target.value)}
                  placeholder="Wpisz odpowiedź..."
                  className="w-full bg-gray-800 text-white border border-blue-500/50 rounded-lg p-4 mb-4 focus:outline-none focus:border-blue-400 min-h-24"
                />

                <button
                  onClick={() => {
                    if (myResponse.trim()) {
                      submitResponse(myResponse);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl transition"
                >
                  Wyślij odpowiedź
                </button>
              </>
            )}
          </div>

          {/* Poprzednia odpowiedź */}
          {otherResponse && (
            <div className="bg-blue-900/30 border-2 border-blue-500/50 rounded-2xl p-8">
              <h4 className="text-lg font-bold text-blue-300 mb-4">
                💬 Odpowiedź {otherPlayer?.name}:
              </h4>
              <p className="text-gray-200 mb-6">{otherResponse}</p>

              {/* Ocena */}
              <div className="flex items-center gap-4 mb-4">
                <p className="font-bold text-gray-300">Oceń odpowiedź:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button
                      key={r}
                      onClick={() => addRating(gameData.currentQuestionIndex - 1, r)}
                      className="text-2xl hover:scale-125 transition"
                    >
                      {r <= rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Komentarz */}
              {!showComment ? (
                <button
                  onClick={() => setShowComment(true)}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
                >
                  <MessageSquare size={18} /> Dodaj komentarz
                </button>
              ) : (
                <div className="mt-4">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Twój komentarz..."
                    className="w-full bg-gray-800 text-white border border-emerald-500/50 rounded-lg p-3 mb-2 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (commentText.trim()) {
                        addComment(gameData.currentQuestionIndex - 1, commentText);
                        setCommentText('');
                        setShowComment(false);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    Prześlij
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Ekran historii
  if (screen === 'history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-emerald-950 p-4">
        <button onClick={() => setScreen('choose_action')} className="text-emerald-400 mb-6 flex items-center gap-2">
          ← Powrót
        </button>

        <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
          📊 Historia gier
        </h2>

        <div className="max-w-4xl mx-auto text-center text-gray-400">
          <p>Historia gier będzie dostępna po zakończeniu gier 📝</p>
        </div>
      </div>
    );
  }

  return null;
};

export default CoupleGameOnline;