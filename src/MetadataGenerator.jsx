import React, { useState, useEffect, useRef } from 'react';
import { Upload, Copy, RefreshCw, Trash2, FileSpreadsheet, Plus, Sparkles, X, Image as ImageIcon, ChevronDown, Download } from 'lucide-react';

// CSS kustom untuk animasi dan scrollbar (disisipkan agar mandiri)
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out forwards;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: #d8b4fe;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #c084fc;
  }
`;

const MetadataGenerator = () => {
  const [items, setItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [globalCategory, setGlobalCategory] = useState('nature');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);

  // Inject styles on mount
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customStyles;
    document.head.appendChild(styleSheet);
    
    // Click outside handler for export menu
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.head.removeChild(styleSheet);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mock data untuk simulasi AI generation
  const mockData = {
    nature: {
      titles: [
        "Majestic Mountain Landscape with Sunset Views",
        "Serene Forest Path During Autumn Season",
        "Tropical Beach Paradise with Palm Trees",
        "Macro Photography of Morning Dew on Grass",
        "Aerial View of River Winding Through Valley"
      ],
      keywords: [
        "nature", "landscape", "outdoors", "mountain", "sky", "scenic", "beautiful", "travel", "sunset", "forest",
        "green", "environment", "summer", "view", "background", "natural", "tourism", "adventure", "water", "tree",
        "wilderness", "panoramic", "idyllic", "peaceful", "horizon", "ecology", "rural", "season", "vacation", "clouds"
      ]
    },
    technology: {
      titles: [
        "Modern Workplace with Laptop and Coffee",
        "Cybersecurity Concept with Digital Padlock",
        "Futuristic Artificial Intelligence Brain",
        "Programmer Coding on Multiple Screens",
        "Virtual Reality Headset User Experience"
      ],
      keywords: [
        "technology", "computer", "business", "digital", "internet", "modern", "work", "communication", "screen", "tech",
        "keyboard", "office", "laptop", "connection", "network", "data", "software", "innovation", "wireless", "smart",
        "online", "device", "corporate", "display", "information", "web", "coding", "programming", "future", "electronics"
      ]
    },
    people: {
      titles: [
        "Diverse Group of Colleagues in Meeting",
        "Portrait of Happy Young Woman Smiling",
        "Family Enjoying Picnic in the Park",
        "Senior Couple Walking on the Beach",
        "Business Man Presenting Chart Data"
      ],
      keywords: [
        "people", "happy", "lifestyle", "person", "woman", "man", "young", "portrait", "smile", "adult",
        "business", "team", "group", "together", "family", "fun", "casual", "friends", "attractive", "male",
        "female", "diversity", "work", "happiness", "joy", "success", "couple", "human", "leisure", "active"
      ]
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newItems = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file: file,
        filename: file.name,
        preview: URL.createObjectURL(file),
        title: "",
        keywords: "",
        category: globalCategory, // Assign current global category initially
        status: 'idle' // idle, processing, done
      }));
      setItems(prev => [...prev, ...newItems]);
    }
    // Reset input value to allow re-uploading same files if needed
    e.target.value = '';
  };

  const removeItem = (id) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== id);
      return newItems;
    });
  };

  const clearAll = () => {
    setItems([]);
  };

  // Generate metadata logic
  const generateMetadata = (targetId = null) => {
    setIsProcessing(true);

    // Helper to get random data
    const getRandomData = (cat) => {
      const data = mockData[cat] || mockData['nature'];
      const randomTitle = data.titles[Math.floor(Math.random() * data.titles.length)];
      // Shuffle and pick top 25 keywords
      const shuffledKeywords = [...data.keywords].sort(() => 0.5 - Math.random());
      const selectedKeywords = shuffledKeywords.slice(0, 25).join(", ");
      return { title: randomTitle, keywords: selectedKeywords };
    };

    setTimeout(() => {
      setItems(prevItems => prevItems.map(item => {
        // If targetId is null, process all 'idle' items. If targetId matches, process that one.
        if (targetId === null || item.id === targetId) {
          const aiData = getRandomData(item.category);
          return {
            ...item,
            title: aiData.title,
            keywords: aiData.keywords,
            status: 'done'
          };
        }
        return item;
      }));
      setIsProcessing(false);
    }, 1500);
  };

  const handleTextChange = (id, field, value) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // --- Export Logic ---

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setShowExportMenu(false);
  };

  // Escape quotes logic for CSV
  const escapeCSV = (text) => `"${(text || '').replace(/"/g, '""')}"`;

  // Definition of export formats
  const exportFormats = {
    adobe: {
      name: "Adobe Stock",
      filename: "adobe_stock_metadata.csv",
      generate: (items) => {
        const headers = ["Filename", "Description", "Keywords", "Category", "Releases"];
        const rows = items.map(item => [
          escapeCSV(item.filename),
          escapeCSV(item.title),
          escapeCSV(item.keywords),
          "1", // Default category ID
          ""   // Releases
        ].join(","));
        return [headers.join(","), ...rows].join("\n");
      }
    },
    shutterstock: {
      name: "Shutterstock",
      filename: "shutterstock_metadata.csv",
      generate: (items) => {
        const headers = ["Filename", "Description", "Keywords", "Categories"];
        const rows = items.map(item => [
          escapeCSV(item.filename),
          escapeCSV(item.title),
          escapeCSV(item.keywords),
          "Nature" // Default category name example
        ].join(","));
        return [headers.join(","), ...rows].join("\n");
      }
    },
    freepik: {
      name: "Freepik",
      filename: "freepik_metadata.csv",
      generate: (items) => {
        // Freepik format: Filename, Title, Keywords
        const headers = ["Filename", "Title", "Keywords"];
        const rows = items.map(item => [
          escapeCSV(item.filename),
          escapeCSV(item.title),
          escapeCSV(item.keywords)
        ].join(","));
        return [headers.join(","), ...rows].join("\n");
      }
    },
    universal: {
      name: "Universal / General",
      filename: "all_metadata.csv",
      generate: (items) => {
        const headers = ["Filename", "Title", "Description", "Keywords", "Category"];
        const rows = items.map(item => [
          escapeCSV(item.filename),
          escapeCSV(item.title),
          escapeCSV(item.title), // Duplicate title to desc
          escapeCSV(item.keywords),
          escapeCSV(item.category)
        ].join(","));
        return [headers.join(","), ...rows].join("\n");
      }
    }
  };

  const handleExport = (type) => {
    if (items.length === 0) return;
    const format = exportFormats[type];
    const content = format.generate(items);
    downloadCSV(content, format.filename);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 text-white p-2 rounded-lg">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bulk Metadata Generator</h1>
              <p className="text-sm text-gray-500">Multi-Agency Export Support (Adobe, Shutterstock, Freepik)</p>
            </div>
          </div>
          
          <div className="flex gap-3">
             <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-purple-400 transition-all flex items-center gap-2 shadow-sm select-none">
                <Plus size={18} />
                Add Images
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
              
              {items.length > 0 && (
                <div className="relative" ref={exportMenuRef}>
                  <button 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-md shadow-green-200 transition-all flex items-center gap-2"
                  >
                    <FileSpreadsheet size={18} />
                    Export
                    <ChevronDown size={16} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Select Platform
                        </div>
                        {Object.entries(exportFormats).map(([key, format]) => (
                          <button
                            key={key}
                            onClick={() => handleExport(key)}
                            className="w-full text-left px-4 py-3 hover:bg-purple-50 text-sm text-gray-700 hover:text-purple-700 flex items-center gap-2 transition-colors"
                          >
                            <Download size={14} />
                            {format.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </header>

        {/* Control Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between sticky top-2 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">AI Context:</span>
              <select 
                value={globalCategory}
                onChange={(e) => setGlobalCategory(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Auto">Auto</option>
                <option value="nature">Nature & Travel</option>
                <option value="technology">Tech & Business</option>
                <option value="people">Lifestyle & People</option>
              </select>
            </div>
            <div className="text-sm text-gray-400 border-l pl-4 hidden md:block">
              {items.length} images loaded
            </div>
          </div>

          <div className="flex gap-2">
             <button
                onClick={clearAll}
                disabled={items.length === 0}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Clear All</span>
              </button>

            <button
              onClick={() => generateMetadata(null)}
              disabled={items.length === 0 || isProcessing}
              className={`
                px-6 py-2 rounded-lg font-medium text-white flex items-center gap-2 transition-all shadow-md
                ${items.length === 0 || isProcessing 
                  ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'}
              `}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="animate-spin w-4 h-4" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate All
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        {items.length === 0 ? (
          // Empty State
          <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-white h-96 flex flex-col items-center justify-center p-8 text-center hover:border-purple-400 transition-colors">
            <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
              <Upload size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mulai dengan Upload Gambar</h3>
            <p className="text-gray-500 max-w-md mb-8">
              Drag & drop banyak gambar sekaligus di sini. Kami akan membantu membuatkan metadata untuk berbagai Microstock.
            </p>
            <label className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 transition-transform hover:scale-105">
              Pilih Gambar
              <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>
        ) : (
          // Table View
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                    <th className="p-4 w-24 text-center">Preview</th>
                    <th className="p-4 w-1/4 min-w-[200px]">Description (Title)</th>
                    <th className="p-4 min-w-[300px]">Keywords</th>
                    <th className="p-4 w-20 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 group transition-colors">
                      {/* Thumbnail & Filename */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 relative">
                            <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                            {item.status === 'done' && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full shadow-sm ring-2 ring-white"></div>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 truncate w-20 text-center" title={item.filename}>
                            {item.filename}
                          </span>
                        </div>
                      </td>

                      {/* Title / Description Input */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1 h-full">
                          <label className="text-xs font-bold text-gray-400">Description (Title)</label>
                          <textarea
                            value={item.title}
                            onChange={(e) => handleTextChange(item.id, 'title', e.target.value)}
                            placeholder="Generate or type description..."
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-h-[80px] resize-none"
                          />
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{item.title.length} chars</span>
                            {item.title.length > 200 && <span className="text-red-500">Too long for title</span>}
                          </div>
                        </div>
                      </td>

                      {/* Keywords Input */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1 h-full">
                          <label className="text-xs font-bold text-gray-400">Keywords (Comma Separated)</label>
                          <textarea
                            value={item.keywords}
                            onChange={(e) => handleTextChange(item.id, 'keywords', e.target.value)}
                            placeholder="keyword1, keyword2, keyword3..."
                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[80px]"
                          />
                          <div className="flex justify-between items-center mt-1">
                            <div className="flex gap-2">
                               {item.keywords && (
                                <button 
                                  onClick={() => navigator.clipboard.writeText(item.keywords)}
                                  className="text-xs flex items-center gap-1 text-gray-500 hover:text-green-600 bg-gray-100 hover:bg-green-50 px-2 py-1 rounded transition-colors"
                                >
                                  <Copy size={10} /> Copy
                                </button>
                               )}
                            </div>
                            <span className="text-xs text-gray-400">
                              {item.keywords ? item.keywords.split(',').length : 0} tags
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MetadataGenerator;