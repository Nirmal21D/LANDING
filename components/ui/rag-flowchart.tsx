"use client"

import { Globe, Database, Brain, MessageSquare, ArrowRight, Sparkles } from "lucide-react"

export function RAGFlowchart() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
          <Sparkles className="w-4 h-4 mr-2" />
          Real-Time Data & RAG Query
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-4">
          AI-Powered Information Processing
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          How Thikana AI processes real-time data to deliver accurate, contextual responses
        </p>
      </div>
      
      <div className="relative">
        {/* Desktop Flow */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between">
            {/* Start Node */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  1
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">User Request</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Business query or question</p>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-20 h-2 bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full shadow-lg"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-l-accent border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  2
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">Web Scraping</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Real-time content collection</p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-20 h-2 bg-gradient-to-r from-accent via-accent/80 to-primary rounded-full shadow-lg"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-l-primary border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  3
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">Cloud Storage</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Vector embeddings</p>
              </div>
            </div>

            {/* Arrow 3 */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-20 h-2 bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full shadow-lg"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-l-accent border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  4
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">RAG System</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Retrieve relevant info</p>
              </div>
            </div>

            {/* Arrow 4 */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-20 h-2 bg-gradient-to-r from-accent via-accent/80 to-primary rounded-full shadow-lg"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-l-primary border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* End Node */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  5
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">Accurate Response</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">For business</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-10">
          {/* Start */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                1
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">User Request</h4>
              <p className="text-sm text-muted-foreground">Business query or question</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-2 h-8 bg-gradient-to-b from-primary via-primary/80 to-accent rounded-full shadow-lg"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-t-[8px] border-t-accent border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent drop-shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                2
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">Web Scraping</h4>
              <p className="text-sm text-muted-foreground">Real-time content collection</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full"></div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                3
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">Cloud Storage</h4>
              <p className="text-sm text-muted-foreground">Vector embeddings</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-2 h-8 bg-gradient-to-b from-primary via-primary/80 to-accent rounded-full shadow-lg"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-t-[8px] border-t-accent border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent drop-shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                4
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">RAG System</h4>
              <p className="text-sm text-muted-foreground">Retrieve relevant info</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-1 h-8 bg-gradient-to-b from-accent to-primary rounded-full"></div>
          </div>

          {/* End */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                5
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">Accurate Response</h4>
              <p className="text-sm text-muted-foreground">For business</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
