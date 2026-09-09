const fs = require('fs');
let content = fs.readFileSync('src/app/rodina/remesla/roman-jakubcak/page.tsx', 'utf8');

const hooks = `
  // Handle global mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [calcTotal, setCalcTotal] = useState(0);
`;

content = content.replace('// Handle global mouse move', hooks);
fs.writeFileSync('src/app/rodina/remesla/roman-jakubcak/page.tsx', content);
