import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-100 bg-white/80 backdrop-blur-sm px-4 shadow-sm">
      <SidebarTrigger className="-ml-1 hover:bg-slate-100 transition-colors rounded-md" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-slate-200" />
      <div className="flex flex-1 items-center gap-2">
        {breadcrumbs && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.label} className="flex items-center gap-2">
                  <BreadcrumbItem>
                    {breadcrumb.href ? (
                      <BreadcrumbLink 
                        href={breadcrumb.href}
                        className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
                      >
                        {breadcrumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-slate-900 font-semibold">
                        {breadcrumb.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && (
                    <BreadcrumbSeparator className="text-slate-400" />
                  )}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <div className="text-right">
          <h1 className="text-lg font-bold text-slate-900">{title}</h1>
          {description && (
            <p className="text-sm text-slate-600 font-medium">{description}</p>
          )}
        </div>
      </div>
    </header>
  )
}
