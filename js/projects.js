/* Project data. To add a project, copy one block and edit it:
 * the filters update by themselves.
 *
 *   context : 'university' or 'personal'
 *   team    : true when it was built with classmates
 *   image   : path to a screenshot, OR
 *   code    : a few lines shown as the cover, with their title in file
 *   repo / live : links (optional, only for public code and sites)
 */
window.PROJECTS = [
    {
        title: 'Store in microservices',
        context: 'university',
        year: 2026,
        tech: ['Java', 'Spring Boot', 'Kafka', 'gRPC', 'PostgreSQL', 'SQL', 'Docker', 'REST API', 'JUnit', 'Maven'],
        summary: 'A store split into order, product and supplier services, each with its own database. Services talk over REST, Kafka events and gRPC, with retries, a dead letter topic and idempotent consumers, and integration tests on Testcontainers.',
        file: 'architecture',
        code: [
            'order-service',
            '└─ Kafka  OrderConfirmed',
            '   └─> product-service',
            'supplier-service',
            '├─ Kafka  SupplierDeactivated',
            '├─ gRPC   CountProductsBySupplier',
            '└─> product-service'
        ]
    },
    {
        title: 'DEISI Island',
        context: 'university',
        team: true,
        year: 2026,
        tech: ['Java', 'Maven'],
        summary: 'A turn-based simulation of rabbits and foxes living on an island. Each species moves, eats and spends energy by its own rules, modelled with inheritance and validated input. Still in development.',
        file: 'classes',
        code: [
            'GameManager',
            '└─ Island',
            '   ├─ Terrain',
            '   └─ Animal',
            '      ├─ Rabbit',
            '      └─ Fox'
        ]
    },
    {
        title: 'Academic portfolio with a tennis API',
        context: 'university',
        year: 2026,
        tech: ['Python', 'Django', 'REST API', 'PostgreSQL', 'Docker', 'GitHub Actions', 'HTML', 'CSS'],
        summary: 'A Django site with login by password or one-time email link, articles with likes and comments, and a Django Ninja API for tennis players, tournaments and matches protected by API keys. A pipeline builds the Docker image and deploys it.',
        file: 'api/api.py',
        code: [
            "@api.get('/jogadores/', tags=['Jogadores'])",
            '@paginate(PageNumberPagination, page_size=10)',
            'def listar_jogadores(request, nome=None):',
            '    qs = Jogador.objects.all()',
            '    if nome:',
            '        qs = qs.filter(nome__icontains=nome)',
            '    return qs'
        ]
    },
    {
        title: 'Susana Cardoso',
        context: 'personal',
        year: 2026,
        tech: ['TypeScript', 'React', 'Tailwind CSS', 'Vercel Blob'],
        summary: 'The site of a pyrography artist, in Portuguese and English, with a gallery, a commissions page and a private panel where she manages the catalogue. Started in Lovable, then rebuilt: new design, storage moved to Vercel Blob and a new admin panel.',
        image: 'images/portfolio/susana-cardoso.jpg',
        live: 'https://susanacardoso.vercel.app'
    },
    {
        title: 'DEISI World Meter',
        context: 'university',
        team: true,
        year: 2026,
        tech: ['Java', 'JUnit'],
        summary: 'A command-line program that loads cities, countries and population data from CSV files and answers queries over them. Hash-map indexes keep lookups by country and year in constant time.',
        file: 'commands',
        code: [
            'GET_CITIES_BY_COUNTRY',
            'GET_TOP_POPULATION_INCREASE',
            'GET_COUNTRIES_GENDER_GAP',
            'GET_CITIES_AT_DISTANCE',
            'GET_COUNTRIES_ABOVE_AVERAGE',
            'INSERT_CITY',
            'REMOVE_COUNTRY'
        ]
    },
    {
        title: 'The Great Programming Journey',
        context: 'university',
        team: true,
        year: 2026,
        tech: ['Java', 'JUnit', 'UML'],
        summary: 'A board game engine about the life of a programmer. Players fall into abysses such as a crash or an infinite loop and use tools to escape. Every abyss and tool is its own class, with no instanceof.',
        file: 'AbyssLLM.java',
        code: [
            'public class AbyssLLM extends AbyssBase {',
            '',
            '    public AbyssLLM(int position) {',
            '        super(20, position);',
            '    }',
            '',
            '    @Override'
        ],
        repo: 'https://github.com/miguel-baptista07/TheGreatProgrammingJourney'
    },
    {
        title: 'Operating system simulator',
        context: 'university',
        team: true,
        year: 2025,
        tech: ['C'],
        summary: 'A simulator that shares the processor between programs with round-robin scheduling and manages virtual memory with paging and swap. Pages are replaced by FIFO, random, clock or LRU. Extends a base supplied by the course.',
        file: 'algorithms',
        code: [
            'page replacement',
            '├─ FIFO',
            '├─ RANDOM',
            '├─ CLOCK',
            '└─ LRU'
        ]
    },
    {
        title: 'DEISI Shop',
        context: 'university',
        year: 2025,
        tech: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'JavaScript', 'REST API'],
        summary: 'An online shop built twice: first in plain JavaScript, with search, sorting, a basket and checkout, then in Next.js with dynamic routes, data loaded with SWR and favourites saved in the browser.',
        file: 'components/ProdutoCard.tsx',
        code: [
            'function toggleFavorite() {',
            '  let favorites = JSON.parse(',
            '    localStorage.getItem("favorites") || "[]"',
            '  );',
            '',
            '  if (favorites.includes(product.id)) {'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/appnext'
    },
    {
        title: 'This website',
        context: 'personal',
        year: 2026,
        tech: ['HTML', 'CSS', 'JavaScript'],
        summary: 'My résumé as a site, with no framework. The project filter and the shell on the first screen are plain JavaScript.',
        file: 'js/site.js',
        code: [
            'function flip(t) {',
            '    if (state.tech.has(t)) state.tech.delete(t);',
            '    else state.tech.add(t);',
            '}'
        ],
        repo: 'https://github.com/a22408651GoncaloAlmeida/goncaloalmeida'
    }
];
