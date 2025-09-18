"use client"

import { Building2, MapPin, Database, Search, ArrowRight, Users } from "lucide-react"

export function BusinessFlowchart() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4 border border-accent/20">
          <Users className="w-4 h-4 mr-2" />
          Business Registration & Discovery
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-4">
          Local Business Network
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          How businesses join the platform and customers discover them through intelligent matching
        </p>
      </div>
      
      <div className="relative">
        {/* Desktop Flow */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between">
            {/* Start Node */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  1
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">Local Business</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Signs up to platform</p>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-20 h-2 bg-gradient-to-r from-accent via-accent/80 to-primary rounded-full shadow-lg"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-l-primary border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Step 1 */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  2
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">Collect Details</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Business info & location</p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-20 h-2 bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full shadow-lg"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-l-accent border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  3
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">Store in Database</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Vectorized embeddings</p>
              </div>
            </div>

            {/* Arrow 3 */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-20 h-2 bg-gradient-to-r from-accent via-accent/80 to-primary rounded-full shadow-lg"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-l-primary border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  4
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">Enable Search</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">Location & services</p>
              </div>
            </div>

            {/* Arrow 4 */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-20 h-2 bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full shadow-lg"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-0 h-0 border-l-[8px] border-l-accent border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent drop-shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* End Node */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent/80 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 border-4 border-background">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-background shadow-lg">
                  5
                </div>
              </div>
              <div className="mt-6 text-center max-w-36">
                <h4 className="text-lg font-bold text-foreground mb-2">Display Results</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">For customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-10">
          {/* Start */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                1
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">Local Business</h4>
              <p className="text-sm text-muted-foreground">Signs up to platform</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-2 h-8 bg-gradient-to-b from-accent via-accent/80 to-primary rounded-full shadow-lg"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-t-[8px] border-t-primary border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent drop-shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Step 1 */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                2
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">Collect Details</h4>
              <p className="text-sm text-muted-foreground">Business info & location</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                3
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">Store in Database</h4>
              <p className="text-sm text-muted-foreground">Vectorized embeddings</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-2 h-8 bg-gradient-to-b from-accent via-accent/80 to-primary rounded-full shadow-lg"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-t-[8px] border-t-primary border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent drop-shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                4
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">Enable Search</h4>
              <p className="text-sm text-muted-foreground">Location & services</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          </div>

          {/* End */}
          <div className="flex items-center space-x-6 group">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-background">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs border border-background shadow-md">
                5
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-foreground mb-1">Display Results</h4>
              <p className="text-sm text-muted-foreground">For customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
