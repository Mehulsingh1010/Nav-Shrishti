import React from 'react'
import { DashboardShell } from './_components/dashboard-shell'

function layout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <DashboardShell>

{children}

        </DashboardShell>
      
    </div>
  )
}

export default layout
