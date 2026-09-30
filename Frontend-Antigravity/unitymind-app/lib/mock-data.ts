import type { Project, ProjectFile, SearchResult, ActivityItem, ChatMessage } from '@/types';

// ─────────── Mock Projects ───────────

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Stellar Runner',
    unityVersion: '2022.3.15f1',
    description: 'A 3D endless runner game with procedural level generation.',
    lastUploadedAt: new Date(Date.now() - 3600000).toISOString(),
    filesUploaded: 217,
    filesIndexed: 217,
    stats: { scripts: 142, scenes: 8, prefabs: 67, dependencies: 23 },
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'proj-2',
    name: 'Tower Defense Pro',
    unityVersion: '2021.3.8f1',
    description: 'Strategic tower defense with wave-based enemy spawning.',
    lastUploadedAt: new Date(Date.now() - 86400000).toISOString(),
    filesUploaded: 155,
    filesIndexed: 155,
    stats: { scripts: 98, scenes: 12, prefabs: 45, dependencies: 18 },
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'proj-3',
    name: 'VR Escape Room',
    unityVersion: '2022.3.2f1',
    description: 'Immersive VR puzzle game with physics-based interactions.',
    lastUploadedAt: undefined,
    filesUploaded: 0,
    filesIndexed: 0,
    stats: { scripts: 0, scenes: 0, prefabs: 0, dependencies: 0 },
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'proj-4',
    name: 'Dungeon Crawler',
    unityVersion: '6000.0.0f1',
    description: 'Roguelike dungeon crawler with procedural generation.',
    lastUploadedAt: new Date(Date.now() - 7200000).toISOString(),
    filesUploaded: 348,
    filesIndexed: 340,
    stats: { scripts: 231, scenes: 5, prefabs: 112, dependencies: 41 },
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// ─────────── Mock Files ───────────

export const MOCK_FILES: ProjectFile[] = [
  { id: 'f1', name: 'PlayerController.cs', type: 'script', path: 'Assets/Scripts/Player/PlayerController.cs' },
  { id: 'f2', name: 'EnemyAI.cs', type: 'script', path: 'Assets/Scripts/Enemy/EnemyAI.cs' },
  { id: 'f3', name: 'GameManager.cs', type: 'script', path: 'Assets/Scripts/Core/GameManager.cs' },
  { id: 'f4', name: 'InventorySystem.cs', type: 'script', path: 'Assets/Scripts/Inventory/InventorySystem.cs' },
  { id: 'f5', name: 'UIManager.cs', type: 'script', path: 'Assets/Scripts/UI/UIManager.cs' },
  { id: 'f6', name: 'MainMenu', type: 'scene', path: 'Assets/Scenes/MainMenu.unity' },
  { id: 'f7', name: 'Level_01', type: 'scene', path: 'Assets/Scenes/Level_01.unity' },
  { id: 'f8', name: 'Level_02', type: 'scene', path: 'Assets/Scenes/Level_02.unity' },
  { id: 'f9', name: 'PlayerPrefab', type: 'prefab', path: 'Assets/Prefabs/Player/Player.prefab' },
  { id: 'f10', name: 'EnemyBasic', type: 'prefab', path: 'Assets/Prefabs/Enemies/EnemyBasic.prefab' },
  { id: 'f11', name: 'Projectile', type: 'prefab', path: 'Assets/Prefabs/Weapons/Projectile.prefab' },
  { id: 'f12', name: 'AudioManager.cs', type: 'script', path: 'Assets/Scripts/Audio/AudioManager.cs' },
  { id: 'f13', name: 'SaveSystem.cs', type: 'script', path: 'Assets/Scripts/Core/SaveSystem.cs' },
  { id: 'f14', name: 'Boss_01', type: 'scene', path: 'Assets/Scenes/Boss_01.unity' },
  { id: 'f15', name: 'PowerUp', type: 'prefab', path: 'Assets/Prefabs/Items/PowerUp.prefab' },
];

// ─────────── Mock Search Results ───────────

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    id: 's1',
    name: 'PlayerController.cs',
    type: 'script',
    path: 'Assets/Scripts/Player/PlayerController.cs',
    description: 'Handles player movement, jumping, and animation state machine transitions.',
  },
  {
    id: 's2',
    name: 'Level_01',
    type: 'scene',
    path: 'Assets/Scenes/Level_01.unity',
    description: 'First playable level with tutorial elements and basic enemy encounters.',
  },
  {
    id: 's3',
    name: 'PlayerPrefab',
    type: 'prefab',
    path: 'Assets/Prefabs/Player/Player.prefab',
    description: 'Main player prefab containing Rigidbody, Collider, and all player components.',
  },
  {
    id: 's4',
    name: 'EnemyAI.cs',
    type: 'script',
    path: 'Assets/Scripts/Enemy/EnemyAI.cs',
    description: 'State-machine-based enemy AI with patrol, chase, and attack behaviors.',
  },
  {
    id: 's5',
    name: 'InventorySystem.cs',
    type: 'script',
    path: 'Assets/Scripts/Inventory/InventorySystem.cs',
    description: 'Manages item collection, storage, and usage with event-driven architecture.',
  },
];

// ─────────── Mock Activity ───────────

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'upload', description: 'Project files uploaded — 142 files successfully uploaded', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a2', type: 'chat', description: 'Chat session: "How does player movement work?"', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a3', type: 'index', description: 'New file indexed: BossController.cs', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'a4', type: 'chat', description: 'Chat session: "Explain the inventory system"', timestamp: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'a5', type: 'upload', description: 'Project files uploaded — 98 files successfully uploaded', timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
];

// ─────────── Mock Chat Messages ───────────

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'cm1',
    role: 'assistant',
    content: "Hello! I'm UnityMind, your AI companion for **Stellar Runner**. I've analyzed your project and I'm ready to help you understand your scripts, scenes, prefabs, and architecture.\n\nWhat would you like to explore today?",
    timestamp: new Date(Date.now() - 120000).toISOString(),
  },
];

// ─────────── Mock AI Responses ───────────

export function getMockAiResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('player') && lower.includes('movement')) {
    return `## Player Movement System

Your player movement is handled by **\`PlayerController.cs\`** located at \`Assets/Scripts/Player/PlayerController.cs\`.

Here's the core movement logic:

\`\`\`csharp
private void HandleMovement()
{
    float horizontal = Input.GetAxis("Horizontal");
    float vertical = Input.GetAxis("Vertical");
    
    Vector3 direction = new Vector3(horizontal, 0f, vertical).normalized;
    
    if (direction.magnitude >= 0.1f)
    {
        float targetAngle = Mathf.Atan2(direction.x, direction.z) * Mathf.Rad2Deg + cam.eulerAngles.y;
        float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref turnSmoothVelocity, turnSmoothTime);
        transform.rotation = Quaternion.Euler(0f, angle, 0f);
        
        Vector3 moveDir = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
        controller.Move(moveDir.normalized * moveSpeed * Time.deltaTime);
    }
}
\`\`\`

**Key components:**
- Uses \`CharacterController\` for collision detection
- Camera-relative movement with smooth rotation
- Jump handled separately in \`HandleJump()\`

**Referenced by:** \`GameManager.cs\`, \`AnimationController.cs\``;
  }

  if (lower.includes('inventory')) {
    return `## Inventory System

Your inventory is implemented in **\`InventorySystem.cs\`** at \`Assets/Scripts/Inventory/InventorySystem.cs\`.

It uses an **event-driven architecture** with a singleton pattern:

\`\`\`csharp
public class InventorySystem : MonoBehaviour
{
    public static InventorySystem Instance { get; private set; }
    
    [SerializeField] private int maxSlots = 24;
    private List<ItemData> items = new List<ItemData>();
    
    public event Action<ItemData> OnItemAdded;
    public event Action<ItemData> OnItemRemoved;
    
    public bool AddItem(ItemData item)
    {
        if (items.Count >= maxSlots) return false;
        items.Add(item);
        OnItemAdded?.Invoke(item);
        return true;
    }
}
\`\`\`

**Scripts referencing \`InventorySystem\`:**
- \`PlayerController.cs\` — item pickup
- \`UIManager.cs\` — inventory display
- \`SaveSystem.cs\` — persistence`;
  }

  if (lower.includes('explain') || lower.includes('overview') || lower.includes('architecture')) {
    return `## Stellar Runner — Project Overview

Your project has **142 scripts**, **8 scenes**, and **67 prefabs** organized in a clean MVC-like architecture.

### Core Systems
| System | File | Purpose |
|--------|------|---------|
| Game Loop | \`GameManager.cs\` | Scene management, game states |
| Player | \`PlayerController.cs\` | Input, movement, animations |
| Enemies | \`EnemyAI.cs\` | State machine AI |
| Inventory | \`InventorySystem.cs\` | Item management |
| Audio | \`AudioManager.cs\` | SFX and music |
| Save | \`SaveSystem.cs\` | PlayerPrefs + JSON |

### Scene Structure
- **MainMenu** → title screen and settings
- **Level_01–02** → playable levels
- **Boss_01** → boss encounter

### Design Patterns Used
- **Singleton**: \`GameManager\`, \`AudioManager\`, \`InventorySystem\`
- **Observer/Events**: UI updates, pickups
- **State Machine**: \`EnemyAI\`, \`PlayerController\``;
  }

  if (lower.includes('playercontroller') || lower.includes('reference')) {
    return `## Scripts Referencing \`PlayerController\`

I found **6 scripts** that directly reference \`PlayerController\`:

1. **\`GameManager.cs\`** — Gets player reference on scene load
2. **\`EnemyAI.cs\`** — Accesses player position for chase behavior
3. **\`UIManager.cs\`** — Reads player health and score
4. **\`CameraFollow.cs\`** — Smooth follows the player transform
5. **\`CheckpointSystem.cs\`** — Triggers respawn logic
6. **\`SaveSystem.cs\`** — Serializes player position and stats

The most coupled dependency is **\`EnemyAI.cs\`** which caches the \`PlayerController\` reference at \`Start()\`:

\`\`\`csharp
private PlayerController player;

void Start()
{
    player = FindObjectOfType<PlayerController>();
}
\`\`\`

> ⚠️ Consider using an event or service locator pattern to reduce this tight coupling.`;
  }

  return `I understand you're asking about **"${message}"** in your **Stellar Runner** project.

Let me analyze the relevant files...

Based on my understanding of your project architecture, this involves the following components:

- Check \`Assets/Scripts/Core/\` for game-wide systems
- Review the scene hierarchy in your Unity scenes
- The \`GameManager.cs\` coordinates most high-level logic

Would you like me to dive deeper into any specific script or system? Try asking:
- *"Show me how GameManager works"*
- *"Which scripts use the event system?"*
- *"Explain the save system"*`;
}
