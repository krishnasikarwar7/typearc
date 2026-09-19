import type {
  Achievement,
  CodeLanguage,
  LeaderboardEntry,
  PlayModeDef,
  RecentTest,
} from "@/types";

export const COMMON_WORDS = [
  "time", "person", "year", "way", "day", "thing", "man", "world", "life", "hand",
  "part", "child", "eye", "woman", "place", "work", "week", "case", "point", "government",
  "company", "number", "group", "problem", "fact", "system", "program", "question", "money", "story",
  "example", "state", "family", "student", "country", "history", "business", "night", "area", "water",
  "power", "report", "market", "letter", "science", "table", "music", "music", "language", "control",
  "process", "service", "friend", "father", "mother", "road", "quick", "brown", "fox", "jumps",
  "over", "lazy", "dog", "light", "speed", "focus", "clean", "sharp", "build", "learn",
  "create", "design", "future", "signal", "vector", "engine", "stream", "value", "credit", "silent",
  "bridge", "canvas", "shadow", "spark", "flow", "orbit", "pulse", "arc", "frame", "layer",
];

export const CODE_LANGUAGES: CodeLanguage[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
  { id: "java", label: "Java" },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "sql", label: "SQL" },
];

export const CODE_SNIPPETS: Record<string, string[]> = {
  javascript: [
    `const users = await User.find({\n  active: true\n});\n\nreturn users.map(user => ({\n  id: user.id,\n  name: user.name\n}));`,
    `function debounce(fn, delay) {\n  let timer = null;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}`,
    `export const useToggle = (initial = false) => {\n  const [value, setValue] = useState(initial);\n  const toggle = () => setValue(v => !v);\n  return [value, toggle];\n};`,
    `async function fetchProfile(id) {\n  const response = await fetch(\`/api/users/\${id}\`);\n  if (!response.ok) throw new Error("Request failed");\n  return response.json();\n}`,
    `const totals = orders.reduce((result, order) => {\n  const key = order.status;\n  result[key] = (result[key] ?? 0) + order.amount;\n  return result;\n}, {});`,
    `function formatDuration(seconds) {\n  const minutes = Math.floor(seconds / 60);\n  const remaining = String(seconds % 60).padStart(2, "0");\n  return \`\${minutes}:\${remaining}\`;\n}`,
  ],
  python: [
    `def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)`,
    `class Node:\n    def __init__(self, value):\n        self.value = value\n        self.next = None\n\n    def __repr__(self):\n        return f"Node({self.value})"`,
    `with open("data.csv") as f:\n    reader = csv.reader(f)\n    rows = [row for row in reader if row]\nprint(len(rows))`,
    `def normalize_scores(scores):\n    highest = max(scores, default=1)\n    return [round(score / highest, 2) for score in scores]`,
    `from collections import Counter\n\ndef top_words(text, limit=5):\n    words = text.lower().split()\n    return Counter(words).most_common(limit)`,
    `async def fetch_json(session, url):\n    async with session.get(url) as response:\n        response.raise_for_status()\n        return await response.json()`,
  ],
  cpp: [
    `int binarySearch(vector<int>& arr, int target) {\n    int lo = 0, hi = arr.size() - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}`,
    `vector<int> filterEven(const vector<int>& values) {\n    vector<int> result;\n    for (int value : values) {\n        if (value % 2 == 0) result.push_back(value);\n    }\n    return result;\n}`,
    `bool isPalindrome(const string& text) {\n    for (size_t i = 0; i < text.size() / 2; ++i) {\n        if (text[i] != text[text.size() - 1 - i]) return false;\n    }\n    return true;\n}`,
    `unordered_map<string, int> countTags(const vector<string>& tags) {\n    unordered_map<string, int> counts;\n    for (const auto& tag : tags) counts[tag]++;\n    return counts;\n}`,
  ],
  java: [
    `public class Stack<T> {\n    private List<T> items = new ArrayList<>();\n\n    public void push(T item) {\n        items.add(item);\n    }\n\n    public T pop() {\n        return items.remove(items.size() - 1);\n    }\n}`,
    `public static String formatName(String first, String last) {\n    String fullName = first.trim() + " " + last.trim();\n    return fullName.replaceAll("\\\\s+", " ");\n}`,
    `public List<Integer> doubleValues(List<Integer> values) {\n    return values.stream()\n        .filter(value -> value > 0)\n        .map(value -> value * 2)\n        .toList();\n}`,
    `public boolean hasPermission(User user, String permission) {\n    return user != null\n        && user.getPermissions().contains(permission);\n}`,
  ],
  rust: [
    `fn fibonacci(n: u64) -> u64 {\n    match n {\n        0 => 0,\n        1 => 1,\n        _ => fibonacci(n - 1) + fibonacci(n - 2),\n    }\n}`,
    `fn average(values: &[f64]) -> Option<f64> {\n    if values.is_empty() {\n        return None;\n    }\n    Some(values.iter().sum::<f64>() / values.len() as f64)\n}`,
    `fn find_user(users: &[User], id: u64) -> Option<&User> {\n    users.iter().find(|user| user.id == id)\n}`,
    `struct Config {\n    host: String,\n    port: u16,\n}\n\nimpl Config {\n    fn address(&self) -> String {\n        format!("{}:{}", self.host, self.port)\n    }\n}`,
  ],
  go: [
    `func worker(id int, jobs <-chan int, results chan<- int) {\n    for j := range jobs {\n        results <- j * 2\n    }\n}`,
    `func unique(values []string) []string {\n    seen := make(map[string]bool)\n    result := make([]string, 0, len(values))\n    for _, value := range values {\n        if !seen[value] {\n            seen[value] = true\n            result = append(result, value)\n        }\n    }\n    return result\n}`,
    `func retry(attempts int, fn func() error) error {\n    for i := 0; i < attempts; i++ {\n        if err := fn(); err == nil {\n            return nil\n        }\n    }\n    return fmt.Errorf("all attempts failed")\n}`,
    `type Task struct {\n    Title string\n    Done  bool\n}\n\nfunc (task *Task) Complete() {\n    task.Done = true\n}`,
  ],
  sql: [
    `SELECT users.name, COUNT(orders.id) AS total_orders\nFROM users\nLEFT JOIN orders ON orders.user_id = users.id\nGROUP BY users.name\nORDER BY total_orders DESC;`,
    `SELECT project_id, AVG(hours) AS average_hours\nFROM time_entries\nWHERE created_at >= CURRENT_DATE - INTERVAL '30 days'\nGROUP BY project_id\nHAVING AVG(hours) > 2;`,
    `UPDATE tasks\nSET status = 'completed', completed_at = CURRENT_TIMESTAMP\nWHERE id = :task_id\n  AND status != 'completed';`,
    `WITH monthly_sales AS (\n  SELECT DATE_TRUNC('month', created_at) AS month, SUM(total) AS revenue\n  FROM invoices\n  GROUP BY month\n)\nSELECT month, revenue\nFROM monthly_sales\nORDER BY month;`,
  ],
};

export const PLAY_MODES: PlayModeDef[] = [
  { id: "speed-run", name: "Speed Run", description: "Pure speed challenge." },
  { id: "hardcore", name: "Hardcore", description: "One mistake ends the run." },
  { id: "type-attack", name: "Type Attack", description: "Words approach — clear them before they land." },
  { id: "race", name: "Race", description: "Race against live opponent ghosts." },
];

const NAMES = [
  "kishu", "vantablack", "nyxwave", "orbitfox", "glasscipher", "quietsprint",
  "ferrousjay", "haloquark", "driftcode", "emberlynx", "zeroflux", "paperjet",
  "duskrider", "lucidarc", "crimsonbit", "nullwave", "swiftcarbon", "moonforge",
];

function hashColor(seed: string) {
  const colors = ["#2A835F", "#8BBB92", "#4B9E79", "#D76D72", "#A8C9A6", "#12544F"];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % colors.length;
  return colors[h];
}

export function generateLeaderboard(seedOffset = 0): LeaderboardEntry[] {
  return NAMES.map((name, i) => {
    const wpm = 145 - i * 4 - (seedOffset % 3);
    const accuracy = 99.2 - i * 0.35;
    return {
      rank: i + 1,
      username: name,
      initials: name.slice(0, 2).toUpperCase(),
      wpm: Math.max(62, wpm),
      accuracy: Math.max(90, Math.round(accuracy * 10) / 10),
      score: Math.round((wpm * accuracy) / 10) * 78,
      color: hashColor(name),
    };
  });
}

export const RECENT_TESTS: RecentTest[] = [
  { id: "1", mode: "Time · 60s", wpm: 104, accuracy: 98.2, date: "Today, 2:41 PM", score: 8420 },
  { id: "2", mode: "Coder · JavaScript", wpm: 88, accuracy: 96.5, date: "Today, 1:05 PM", score: 6210 },
  { id: "3", mode: "Speed Run", wpm: 111, accuracy: 97.8, date: "Yesterday", score: 9040 },
  { id: "4", mode: "Time · 30s", wpm: 96, accuracy: 95.1, date: "Yesterday", score: 5330 },
  { id: "5", mode: "Hardcore", wpm: 79, accuracy: 100, date: "2 days ago", score: 7100 },
  { id: "6", mode: "Coder · Python", wpm: 84, accuracy: 94.7, date: "3 days ago", score: 5980 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", label: "100 WPM", description: "Break the triple-digit barrier.", unlocked: true },
  { id: "a2", label: "Perfect Run", description: "Finish a test at 100% accuracy.", unlocked: true },
  { id: "a3", label: "7 Day Streak", description: "Type every day for a week.", unlocked: true },
  { id: "a4", label: "Code Master", description: "Reach 90 WPM in Coder mode.", unlocked: false },
  { id: "a5", label: "Speed Demon", description: "Hit 130 WPM in any test.", unlocked: false },
  { id: "a6", label: "First Victory", description: "Win a Race mode match.", unlocked: true },
];

export const WPM_HISTORY = [72, 76, 74, 81, 85, 83, 88, 91, 89, 94, 97, 93, 99, 104];

export const STRENGTHS = [
  { label: "Letters", value: 96 },
  { label: "Numbers", value: 91 },
  { label: "Symbols", value: 87 },
  { label: "Punctuation", value: 89 },
];
