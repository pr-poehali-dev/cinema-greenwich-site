import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Movie {
  id: string;
  title: string;
  time: string;
  price: number;
}

interface BarItem {
  name: string;
  price: number;
  unit?: string;
}

interface TicketData {
  ticketNumber: string;
  movie: string;
  date: string;
  time: string;
  seats: number[];
  email: string;
  total: number;
}

const movies: Movie[] = [
  { id: '1', title: 'Зверополис 2', time: '9:30', price: 650 },
  { id: '2', title: 'Чебурашка 2', time: '11:55', price: 450 },
  { id: '3', title: 'Гренландия 2: Миграция', time: '14:05', price: 450 },
  { id: '4', title: 'Буратино', time: '16:00', price: 450 },
  { id: '5', title: 'Папины дочки: Мама вернулась', time: '18:05', price: 450 },
  { id: '6', title: 'Зверополис 2', time: '20:10', price: 650 },
  { id: '7', title: 'Возвращение в Сайлент-Хилл', time: '22:15', price: 650 },
  { id: '8', title: 'Убежище', time: '0:20', price: 650 },
];

const barMenu: BarItem[] = [
  { name: 'Попкорн маленький', price: 330 },
  { name: 'Попкорн средний', price: 390 },
  { name: 'Попкорн большой', price: 450 },
  { name: 'Сладкая вата', price: 250 },
  { name: 'Кока-кола', price: 120 },
  { name: 'Мармеладки', price: 280, unit: '100 г' },
];

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-02-08');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(new Set());
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  const generateDates = () => {
    const dates = [];
    const start = new Date('2026-02-08');
    for (let i = 0; i < 5; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
        weekday: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
      });
    }
    return dates;
  };

  const dates = generateDates();

  const handleBuyTicket = (movie: Movie) => {
    setSelectedMovie(movie);
    setSelectedSeats([]);
    setShowSeatSelection(true);
  };

  const toggleSeat = (seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleContinueToEmail = () => {
    if (selectedSeats.length === 0) {
      toast.error('Выберите хотя бы одно место');
      return;
    }
    setShowSeatSelection(false);
    setShowEmailDialog(true);
  };

  const generateTicketNumber = () => {
    return `GW${Date.now().toString().slice(-8)}`;
  };

  const handlePurchase = () => {
    if (!email || !email.includes('@')) {
      toast.error('Укажите корректный email');
      return;
    }

    const total = selectedSeats.length * (selectedMovie?.price || 0);
    const ticketNumber = generateTicketNumber();
    
    const newBookedSeats = new Set(bookedSeats);
    selectedSeats.forEach(seat => {
      newBookedSeats.add(`${selectedDate}-${selectedMovie?.id}-${seat}`);
    });
    setBookedSeats(newBookedSeats);

    const ticket = {
      ticketNumber,
      movie: selectedMovie?.title || '',
      date: new Date(selectedDate).toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: selectedMovie?.time || '',
      seats: selectedSeats.sort((a, b) => a - b),
      email,
      total,
    };

    setTicketData(ticket);
    setShowEmailDialog(false);
    setShowTicketDialog(true);
    setSelectedSeats([]);
    setEmail('');

    toast.success('Билет отправлен на вашу почту!', { duration: 5000 });
  };

  const isSeatBooked = (seatNumber: number): boolean => {
    return bookedSeats.has(`${selectedDate}-${selectedMovie?.id}-${seatNumber}`);
  };

  const closeAllDialogs = () => {
    setShowSeatSelection(false);
    setShowEmailDialog(false);
    setShowTicketDialog(false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="animate-float">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                ГРИНВИЧ
              </h1>
              <p className="text-sm text-purple-300/70 mt-2 tracking-widest uppercase">Екатеринбург</p>
            </div>
            <nav className="hidden md:flex gap-8">
              <a href="#schedule" className="text-sm font-semibold hover:text-purple-400 transition-all hover:scale-110">
                Афиша
              </a>
              <a href="#bar" className="text-sm font-semibold hover:text-blue-400 transition-all hover:scale-110">
                Бар
              </a>
              <a href="#contacts" className="text-sm font-semibold hover:text-pink-400 transition-all hover:scale-110">
                Контакты
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full mb-8 animate-glow">
            <Icon name="Sparkles" size={20} className="text-purple-400" />
            <span className="font-bold text-purple-300 tracking-wide">ПРЕМИУМ КИНОТЕАТР</span>
          </div>
          <h2 className="text-7xl md:text-9xl font-black mb-8 bg-gradient-to-r from-purple-400 via-pink-300 to-blue-400 bg-clip-text text-transparent animate-float">
            CINEMA
          </h2>
          <div className="flex flex-wrap justify-center gap-8 text-lg mb-12">
            <div className="glass px-8 py-4 rounded-2xl">
              <span className="text-purple-400 font-bold text-3xl">460</span>
              <span className="text-white/70 ml-2">мест</span>
            </div>
            <div className="glass px-8 py-4 rounded-2xl">
              <span className="text-blue-400 font-bold text-3xl">9:00-2:00</span>
            </div>
            <div className="glass px-8 py-4 rounded-2xl">
              <span className="text-pink-400 font-bold text-3xl">ТРЦ ГРИНВИЧ</span>
            </div>
          </div>
          <Button 
            size="lg" 
            className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:scale-110 transition-all animate-glow text-white font-bold rounded-2xl"
            onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Icon name="Ticket" className="mr-3" size={28} />
            КУПИТЬ БИЛЕТ
          </Button>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              СЕАНСЫ
            </h3>
            <p className="text-white/60 text-lg">Выберите дату и время</p>
          </div>
          
          {/* Date selector */}
          <div className="flex gap-4 justify-center mb-16 flex-wrap">
            {dates.map((date) => (
              <Button
                key={date.value}
                variant={selectedDate === date.value ? 'default' : 'outline'}
                onClick={() => setSelectedDate(date.value)}
                className={`flex flex-col h-auto py-6 px-10 transition-all rounded-2xl ${
                  selectedDate === date.value 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 scale-110 animate-glow border-0' 
                    : 'glass hover:scale-105 border-white/20'
                }`}
              >
                <span className="text-xs opacity-70 uppercase tracking-widest font-bold">{date.weekday}</span>
                <span className="text-2xl font-black mt-2">{date.label}</span>
              </Button>
            ))}
          </div>

          {/* Movies grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <Card 
                key={movie.id} 
                className="glass p-8 hover:scale-105 transition-all group hover:border-purple-500/50 rounded-3xl"
              >
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-6">
                    <h4 className="text-xl font-bold leading-tight group-hover:text-purple-400 transition-colors">
                      {movie.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className="ml-3 text-xl font-black bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 rounded-xl"
                    >
                      {movie.time}
                    </Badge>
                  </div>
                  <div className="glass-strong px-5 py-4 rounded-2xl border border-purple-500/30">
                    <Icon name="Ticket" size={24} className="text-purple-400 inline mr-2" />
                    <span className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{movie.price} ₽</span>
                  </div>
                </div>
                <Button 
                  className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all text-white font-bold rounded-2xl" 
                  onClick={() => handleBuyTicket(movie)}
                >
                  <Icon name="ShoppingCart" className="mr-2" size={20} />
                  КУПИТЬ
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="glass inline-block px-8 py-4 rounded-2xl">
              <Icon name="Calendar" size={16} className="inline mr-2 text-purple-400" />
              <span className="text-white/70">Расписание до 12 февраля 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bar Menu */}
      <section id="bar" className="py-24 relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              БАР
            </h3>
            <p className="text-white/60 text-lg">Попкорн, напитки и сладости</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {barMenu.map((item, index) => (
              <Card 
                key={index} 
                className="glass p-8 flex items-center justify-between hover:scale-105 transition-all rounded-3xl hover:border-blue-500/50"
              >
                <div>
                  <h4 className="font-bold text-xl mb-1">{item.name}</h4>
                  {item.unit && <p className="text-sm text-white/50">{item.unit}</p>}
                </div>
                <span className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {item.price}₽
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              КОНТАКТЫ
            </h3>
            <p className="text-white/60 text-lg">Ждём вас каждый день</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="glass-strong p-10 text-center hover:scale-105 transition-all rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                <Icon name="MapPin" size={36} className="text-white" />
              </div>
              <h4 className="font-black text-2xl mb-4 text-purple-400">АДРЕС</h4>
              <p className="text-white/70 leading-relaxed text-lg">
                Екатеринбург<br />
                ул. 8 Марта, 46<br />
                <span className="font-bold text-purple-300">ТРЦ ГРИНВИЧ</span>
              </p>
            </Card>
            <Card className="glass-strong p-10 text-center hover:scale-105 transition-all rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                <Icon name="Clock" size={36} className="text-white" />
              </div>
              <h4 className="font-black text-2xl mb-4 text-blue-400">РЕЖИМ</h4>
              <p className="text-white/70 leading-relaxed text-lg">
                Ежедневно<br />
                <span className="font-bold text-blue-300 text-3xl">9:00 - 2:00</span>
              </p>
            </Card>
            <Card className="glass-strong p-10 text-center hover:scale-105 transition-all rounded-3xl group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                <Icon name="Users" size={36} className="text-white" />
              </div>
              <h4 className="font-black text-2xl mb-4 text-pink-400">ЗАЛ</h4>
              <p className="text-white/70 leading-relaxed text-lg">
                <span className="font-bold text-pink-300 text-4xl">460</span><br />
                мест премиум-класса
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-strong border-t border-white/10 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/50">© 2026 ГРИНВИЧ СИНЕМА</p>
        </div>
      </footer>

      {/* Seat Selection Dialog */}
      <Dialog open={showSeatSelection} onOpenChange={(open) => !open && closeAllDialogs()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-strong border-purple-500/30 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {selectedMovie?.title}
            </DialogTitle>
            <p className="text-white/60">
              {new Date(selectedDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })} • {selectedMovie?.time} • 
              <span className="text-purple-400 font-bold ml-2">{selectedMovie?.price} ₽</span>
            </p>
          </DialogHeader>

          <div className="py-6">
            <div className="mb-8">
              <div className="glass-strong text-center py-6 rounded-2xl mb-10 border border-purple-500/30">
                <Icon name="Monitor" size={32} className="inline mr-3 text-purple-400" />
                <span className="text-2xl font-black text-purple-300">ЭКРАН</span>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Array.from({ length: 23 }, (_, rowIndex) => (
                  <div key={rowIndex} className="flex gap-3 justify-center">
                    <span className="w-12 text-center font-black text-white/50 pt-3">
                      {rowIndex + 1}
                    </span>
                    {Array.from({ length: 20 }, (_, seatIndex) => {
                      const seatNumber = rowIndex * 20 + seatIndex + 1;
                      const isSelected = selectedSeats.includes(seatNumber);
                      const isBooked = isSeatBooked(seatNumber);

                      return (
                        <button
                          key={seatNumber}
                          onClick={() => !isBooked && toggleSeat(seatNumber)}
                          disabled={isBooked}
                          className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                            isBooked
                              ? 'glass opacity-30 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white scale-125 animate-glow'
                              : 'glass-strong hover:scale-110 hover:border-purple-500/50'
                          }`}
                        >
                          {seatIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-8 justify-center mb-8 glass-strong p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass-strong rounded-xl"></div>
                <span className="font-bold">Свободно</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl"></div>
                <span className="font-bold">Выбрано</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass opacity-30 rounded-xl"></div>
                <span className="font-bold">Занято</span>
              </div>
            </div>

            {selectedSeats.length > 0 && (
              <div className="glass-strong border-2 border-purple-500/30 rounded-2xl p-8 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">Выбрано мест:</span>
                  <span className="font-black text-2xl text-purple-400">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Итого:</span>
                  <span className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {selectedSeats.length * (selectedMovie?.price || 0)} ₽
                  </span>
                </div>
              </div>
            )}

            <Button
              className="w-full py-8 text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all rounded-2xl"
              onClick={handleContinueToEmail}
              disabled={selectedSeats.length === 0}
            >
              <Icon name="ArrowRight" className="mr-2" size={24} />
              ПРОДОЛЖИТЬ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={(open) => !open && closeAllDialogs()}>
        <DialogContent className="max-w-md glass-strong border-purple-500/30 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              EMAIL
            </DialogTitle>
            <p className="text-white/60">
              Билет придет на вашу почту
            </p>
          </DialogHeader>

          <div className="py-6 space-y-8">
            <div>
              <Label htmlFor="email" className="font-bold mb-3 block text-lg">Ваш email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-lg glass-strong border-white/20 rounded-2xl"
              />
            </div>

            <div className="glass-strong border border-purple-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-white/60">Фильм:</span>
                <span className="font-bold">{selectedMovie?.title}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-white/60">Места:</span>
                <span className="font-bold">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10">
                <span className="font-bold text-xl">Итого:</span>
                <span className="text-3xl font-black text-purple-400">
                  {selectedSeats.length * (selectedMovie?.price || 0)} ₽
                </span>
              </div>
            </div>

            <Button
              className="w-full py-8 text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-all rounded-2xl"
              onClick={handlePurchase}
            >
              <Icon name="CreditCard" className="mr-2" size={24} />
              ОПЛАТИТЬ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={(open) => !open && closeAllDialogs()}>
        <DialogContent className="max-w-md glass-strong border-purple-500/30 rounded-3xl">
          <DialogHeader>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                <Icon name="Check" size={48} className="text-white" />
              </div>
              <DialogTitle className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                УСПЕШНО!
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="py-6">
            <div className="glass-strong border-2 border-purple-500/30 rounded-3xl p-8 space-y-5">
              <div className="text-center pb-5 border-b border-white/10">
                <h3 className="text-3xl font-black mb-2">{ticketData?.movie}</h3>
                <p className="text-white/60">{ticketData?.date}</p>
              </div>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Номер</span>
                  <span className="font-mono font-black text-purple-400">{ticketData?.ticketNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Время</span>
                  <span className="font-black">{ticketData?.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Места</span>
                  <span className="font-black">{ticketData?.seats?.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Email</span>
                  <span className="font-black text-sm">{ticketData?.email}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="font-black text-xl">Итого</span>
                  <span className="text-4xl font-black text-purple-400">{ticketData?.total} ₽</span>
                </div>
              </div>

              <div className="pt-5 text-center">
                <div className="glass px-6 py-4 rounded-2xl">
                  <Icon name="Mail" size={24} className="inline mr-2 text-purple-400" />
                  <span className="text-white/70">
                    Отправлено на {ticketData?.email}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 font-black text-lg rounded-2xl"
              onClick={closeAllDialogs}
            >
              ЗАКРЫТЬ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
