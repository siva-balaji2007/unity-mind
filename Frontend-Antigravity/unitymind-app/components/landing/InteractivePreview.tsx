'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';

interface MockFile {
  name: string;
  type: 'script' | 'scene' | 'prefab';
  code?: string;
  response: string;
}

const MOCK_FILES: Record<string, MockFile> = {
  'PlayerController.cs': {
    name: 'PlayerController.cs',
    type: 'script',
    code: `public class PlayerController : MonoBehaviour {\n  public float speed = 10f;\n  private CharacterController controller;\n\n  void Update() {\n    float x = Input.GetAxis("Horizontal");\n    float z = Input.GetAxis("Vertical");\n    Vector3 move = transform.right * x + transform.forward * z;\n    controller.Move(move * speed * Time.deltaTime);\n  }\n}`,
    response: "Here is the movement logic in `PlayerController.cs`. It uses standard Unity `Input.GetAxis` mapped to horizontal/vertical axes and moves the `CharacterController` relative to the player's transform coordinates."
  },
  'EnemyAI.cs': {
    name: 'EnemyAI.cs',
    type: 'script',
    code: `public class EnemyAI : MonoBehaviour {\n  public Transform player;\n  public float chaseRange = 15f;\n\n  void Update() {\n    float dist = Vector3.Distance(player.position, transform.position);\n    if (dist < chaseRange) ChasePlayer();\n  }\n\n  void ChasePlayer() { /* NavMesh pathfinding */ }\n}`,
    response: "`EnemyAI.cs` implements state-machine-based tracking. It measures distance to the Player transform on each frame and switches to target-chasing once in range."
  },
  'Level_01': {
    name: 'Level_01',
    type: 'scene',
    code: `/* Unity Scene Binary Data File */\nSceneHierarchy:\n  - GameObject: Player (ID: 4120)\n  - GameObject: EnemySpawner (ID: 5543)\n  - GameObject: Terrain (ID: 1022)\n  - Light: DirectionalLight (ID: 01)`,
    response: "`Level_01` is your main starting scene. It contains a `PlayerPrefab` instance, an spawner node configuration, and basic environment static colliders."
  },
  'PlayerPrefab': {
    name: 'PlayerPrefab',
    type: 'prefab',
    code: `/* Prefab Serialized Component Map */\nPrefabRoot: Player\n  - Transform\n  - Rigidbody (Mass: 1, Drag: 0)\n  - CapsuleCollider\n  - PlayerController (Speed: 12)`,
    response: "The `PlayerPrefab` links your physics assets and controller component together. It currently depends on `PlayerController.cs` and has a `Rigidbody` + `CapsuleCollider` configured."
  }
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  code?: string;
  fileName?: string;
}

export function InteractivePreview() {
  const [activeFile, setActiveFile] = useState<string>('PlayerController.cs');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I've indexed **Stellar Runner**. I found **142 scripts**, 8 scenes, and 67 prefabs. Select any file on the left or type a question below to see me in action!",
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const triggerAiResponse = (userQuery: string, fileKey?: string) => {
    setIsTyping(true);
    setTimeout(() => {
      let content = "";
      let code = undefined;

      if (fileKey && MOCK_FILES[fileKey]) {
        content = MOCK_FILES[fileKey].response;
        code = MOCK_FILES[fileKey].code;
      } else {
        const query = userQuery.toLowerCase();
        if (query.includes('move') || query.includes('player')) {
          content = MOCK_FILES['PlayerController.cs'].response;
          code = MOCK_FILES['PlayerController.cs'].code;
        } else if (query.includes('enemy') || query.includes('ai')) {
          content = MOCK_FILES['EnemyAI.cs'].response;
          code = MOCK_FILES['EnemyAI.cs'].code;
        } else if (query.includes('scene') || query.includes('level')) {
          content = MOCK_FILES['Level_01'].response;
          code = MOCK_FILES['Level_01'].code;
        } else {
          content = "I've analyzed your project and matched your query. I see that your architecture is highly modular. Ask about movement, AI, or specific files to inspect UnityMind's detailed responses.";
        }
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content,
          code,
          fileName: fileKey
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: userMsg }
    ]);
    setInput('');
    triggerAiResponse(userMsg);
  };

  const handleSelectFile = (fileKey: string) => {
    if (isTyping) return;
    setActiveFile(fileKey);
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: `Inspect file: ${fileKey}` }
    ]);
    triggerAiResponse('', fileKey);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-100 bg-neutral-0 flex flex-col md:flex-row"
      style={{ boxShadow: '0 24px 64px rgba(0,0,0,0.08)' }}
    >
      {/* Mini sidebar */}
      <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-100 bg-neutral-0 flex flex-col flex-shrink-0">
        <div className="p-3.5 border-b border-neutral-100 dark:border-neutral-100 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <Zap size={10} color="white" fill="white" />
          </div>
          <span className="text-[12px] font-bold text-neutral-800 dark:text-neutral-900 tracking-tight">UnityMind Live Demo</span>
        </div>
        <div className="p-2 space-y-0.5 hidden md:block">
          {['Dashboard', 'Projects', 'Search', 'Settings'].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] ${
                i === 1
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-neutral-500'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-sm ${
                  i === 1 ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-neutral-300'
                }`}
              />
              {item}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-100 flex-1">
          <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mb-2 uppercase tracking-widest font-semibold flex items-center gap-1">
            <Sparkles size={8} /> Explorer
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
            {Object.keys(MOCK_FILES).map(key => {
              const isActive = activeFile === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectFile(key)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-50 hover:text-neutral-800'
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-sm ${
                      isActive ? 'bg-white' : MOCK_FILES[key].type === 'script' ? 'bg-blue-400' : 'bg-green-400'
                    }`}
                  />
                  <span className="truncate flex-1">{key}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-h-[380px] bg-neutral-50 dark:bg-neutral-0">
        <div className="flex-1 p-4 space-y-3.5 overflow-y-auto max-h-[320px] min-h-[260px]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : ''}`}>
                {!isUser && (
                  <div className="w-6.5 h-6.5 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <Zap size={10} color="white" />
                  </div>
                )}
                <div
                  className={`rounded-2xl max-w-sm px-3.5 py-2.5 border text-[12.5px] shadow-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white border-transparent rounded-tr-sm'
                      : 'bg-neutral-0 dark:bg-neutral-50 text-neutral-800 dark:text-neutral-900 border-neutral-200 dark:border-neutral-100 rounded-tl-sm'
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.code && (
                    <pre className="bg-neutral-900 text-green-400 font-mono text-[10px] rounded-lg p-2.5 mt-2 overflow-x-auto select-all leading-tight border border-neutral-800">
                      <code>{msg.code}</code>
                    </pre>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-6.5 h-6.5 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse">
                <Zap size={10} color="white" />
              </div>
              <div className="bg-neutral-0 dark:bg-neutral-50 border border-neutral-200 dark:border-neutral-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="border-t border-neutral-200 dark:border-neutral-100 p-3 bg-neutral-0 dark:bg-neutral-0 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'player movement' or ask anything..."
            className="flex-1 bg-neutral-50 dark:bg-neutral-50 border border-neutral-200 dark:border-neutral-100 rounded-xl px-3.5 py-2 text-[12.5px] outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-neutral-800 dark:text-neutral-900 transition-all placeholder:text-neutral-400"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-white transition-all ${
              input.trim() && !isTyping
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                : 'bg-neutral-200 dark:bg-neutral-50 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <ArrowRight size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}
