/* Project data. To add a project, copy one block and edit it:
 * the filters, the counts and the skills list all update by themselves.
 *
 *   context : 'university' or 'personal'
 *   image   : path to a screenshot, OR
 *   code    : a few real lines from the repo, shown as the cover
 *   repo / live : links (optional)
 */
window.PROJECTS = [
    {
        title: 'Academic portfolio in Django',
        context: 'university',
        year: 2026,
        tech: ['Python', 'Django', 'PostgreSQL', 'HTML', 'CSS'],
        summary: 'A full web app with login by password or one-time email link, articles with likes and comments, and pages for courses, final projects and technologies. The database runs on Neon and the media files on Cloudinary.',
        file: 'accounts/models.py',
        code: [
            'class MagicLink(models.Model):',
            '    user = models.ForeignKey(User, ...)',
            '    token = models.UUIDField(default=uuid.uuid4)',
            '    usado = models.BooleanField(default=False)',
            '',
            '    def is_valid(self):',
            '        # Link válido por 15 minutos'
        ]
    },
    {
        title: 'Databases coursework',
        context: 'university',
        year: 2026,
        tech: ['SQL', 'SQL Server'],
        summary: 'Weekly T-SQL exercises on the BikeStores and HR databases: joins, grouping, nested queries and data definition.',
        file: 'a22408651_AP08.sql',
        code: [
            'SELECT s.staff_id, st.store_name,',
            '       m.first_name AS manager_name',
            'FROM sales.staffs s',
            'INNER JOIN sales.stores st',
            '        ON st.store_id = s.store_id',
            'LEFT JOIN sales.staffs m',
            '       ON m.staff_id = s.manager_id'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/dbClasses'
    },
    {
        title: 'Music festival manager',
        context: 'university',
        year: 2026,
        tech: ['Python', 'Django', 'SQLite', 'HTML', 'CSS'],
        summary: 'A Django app I extended to manage a festival: create, edit and delete concerts, list stages and days, and stop two concerts sharing the same stage and time.',
        file: 'festival/models.py',
        code: [
            'class Concerto(models.Model):',
            '    banda = models.ForeignKey(Banda, ...)',
            '    palco = models.ForeignKey(Palco, ...)',
            '',
            '    class Meta:',
            '        unique_together = (("dia", "palco", "hora"),)',
            '        ordering = ["dia__data", "hora"]'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/festival-form-a22408651'
    },
    {
        title: 'DEISI Shop in React',
        context: 'university',
        year: 2025,
        tech: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'REST API'],
        summary: 'A Next.js app with dynamic routes, product pages loaded from an API with SWR, favourites saved in the browser and a searchable list of countries.',
        file: 'components/ProdutoCard.tsx',
        code: [
            'function ProdutoCard({ product }: Props) {',
            '  const [isFavorite, setIsFavorite] = useState(false);',
            '',
            '  function toggleFavorite() {',
            '    let favorites = JSON.parse(',
            '      localStorage.getItem("favorites") || "[]"',
            '    );'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/appnext'
    },
    {
        title: 'React technology explorer',
        context: 'university',
        year: 2025,
        tech: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
        summary: 'My first Next.js app: rated cards for the web technologies I was learning, built from a JSON file.',
        image: 'images/portfolio/next-tech-explorer.jpg',
        repo: 'https://github.com/a22408651GoncaloAlmeida/next',
        live: 'https://next2-nine-sand.vercel.app'
    },
    {
        title: 'ESP32 pattern receiver',
        context: 'university',
        year: 2025,
        tech: ['JavaScript', 'Node.js', 'Express', 'ESP32', 'REST API'],
        summary: 'A small server that receives patterns sent by an ESP32 board over HTTP and shows the latest one on a live page.',
        file: 'server.js',
        code: [
            '// Endpoint para receber os dados do ESP32',
            'app.post("/receive", (req, res) => {',
            '    ultimoPadrao = req.body.pattern;',
            '    console.log("Recebido:", ultimoPadrao);',
            '    res.send("OK");',
            '});'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/projetoAAC'
    },
    {
        title: 'DEISI Shop in JavaScript',
        context: 'university',
        year: 2025,
        tech: ['JavaScript', 'HTML', 'CSS', 'REST API'],
        summary: 'An online shop in plain JavaScript: products from an API, category filter, price sorting, search, and a basket with discounts and checkout.',
        file: 'Lab7/scripts/main.js',
        code: [
            'if (pesquisa) {',
            '  lista = lista.filter(p =>',
            '    p.title.toLowerCase().includes(pesquisa)',
            '  );',
            '}',
            '',
            '// ordenação por preço'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/a22408651GoncaloAlmeida.github.io/tree/main/Lab7'
    },
    {
        title: 'Web labs',
        context: 'university',
        year: 2025,
        tech: ['HTML', 'CSS', 'JavaScript'],
        summary: 'Weekly exercises that go from a first HTML page to layouts, events, counters and data kept in the browser.',
        file: 'Lab5/scripts/main.js',
        code: [
            'let contador = Number(',
            "  localStorage.getItem('lab5_counter')",
            ') || 0;',
            '',
            'const handlePassaOver = () => {',
            "  passaLabel.textContent = '1. Obrigado por passares';",
            '};'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/a22408651GoncaloAlmeida.github.io',
        live: 'https://a22408651goncaloalmeida.github.io'
    },
    {
        title: 'Era uma vez uma Pedra',
        context: 'personal',
        year: 2025,
        tech: ['HTML', 'CSS', 'JavaScript'],
        summary: 'An online gallery for an artist in my family, with paintings, painted stones and pyrography sorted by category. Built as a Christmas present.',
        image: 'images/portfolio/era-uma-vez-uma-pedra.jpg',
        repo: 'https://github.com/a22408651GoncaloAlmeida/eraumavezumapedra',
        live: 'https://eraumavezumapedra.vercel.app'
    },
    {
        title: 'This website',
        context: 'personal',
        year: 2026,
        tech: ['HTML', 'CSS', 'JavaScript'],
        summary: 'My résumé as a site, with no framework. The project filter, the hex dump and the shell below are plain JavaScript.',
        file: 'js/site.js',
        code: [
            'const own = enc.encode(ch);',
            'own.forEach((b, i) => bytes.push({',
            '    b, ch, ci,',
            '    first: i === 0,',
            '    size: own.length',
            '}));'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/goncaloalmeida'
    },
    {
        title: 'Balloon-in-line',
        context: 'university',
        year: 2025,
        tech: ['Kotlin'],
        summary: 'A command-line game in the style of four-in-a-row. Two players drop coloured balloons on an ASCII board and try to line up four.',
        image: 'images/portfolio/jogo balao.png'
    },
    {
        title: 'Boat radar',
        context: 'university',
        year: 2025,
        tech: ['C'],
        summary: 'A command-line radar that draws boats on a grid before and after they move, looks up coordinates and lists the boats that changed place.',
        image: 'images/portfolio/radar barco.png'
    }
];
