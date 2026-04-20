'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Loader2, Search, ArrowRight, Shield, User } from 'lucide-react'
import AdminLayout from '@/components/admin-layout'

interface Account {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
  updatedAt: string
  role: string
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadAccounts = async () => {
      setIsLoading(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          console.warn('API URL not configured')
          setIsLoading(false)
          return
        }

        const response = await fetch(`${apiUrl}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          const formatted = (data.data || []).map((account: any) => ({
            id: account.id,
            email: account.email,
            firstName: account.firstName || '',
            lastName: account.lastName || '',
            createdAt: account.createdAt
              ? new Date(account.createdAt).toLocaleString('ko-KR')
              : '-',
            updatedAt: account.updatedAt
              ? new Date(account.updatedAt).toLocaleString('ko-KR')
              : '-',
            role: account.role || 'user',
          }))
          setAccounts(formatted)
        }
      } catch (err) {
        console.error('Failed to load accounts:', err)
        // API가 없어도 페이지는 렌더링되도록 처리
        setAccounts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadAccounts()
  }, [])

  const filteredAccounts = accounts.filter((account) =>
    account.email.includes(searchTerm) ||
    `${account.firstName} ${account.lastName}`.includes(searchTerm)
  )

  const getRoleVariant = (role: string) => {
    return role === 'admin' ? 'default' : 'secondary'
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: '관리자',
      user: '사용자',
      moderator: '중재자',
    }
    return labels[role] || role
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">계정 관리</h1>
          <p className="text-muted-foreground mt-1">
            총 {accounts.length}개의 계정
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="이메일이나 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>계정 목록</CardTitle>
            <CardDescription>
              {filteredAccounts.length}개의 계정이 표시 중입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">로드 중...</span>
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">계정이 없습니다</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        이메일
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        이름
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        역할
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        가입일
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        최근 업데이트
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account) => (
                      <tr
                        key={account.id}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <td className="h-16 px-4 align-middle">
                          <div className="font-semibold text-sm">{account.email}</div>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <div className="text-sm flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {account.firstName} {account.lastName}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <Badge variant={getRoleVariant(account.role)}>
                            {account.role === 'admin' && (
                              <Shield className="h-3 w-3 mr-1" />
                            )}
                            {getRoleLabel(account.role)}
                          </Badge>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <div className="text-sm text-muted-foreground">
                            {account.createdAt}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle">
                          <div className="text-sm text-muted-foreground">
                            {account.updatedAt}
                          </div>
                        </td>
                        <td className="h-16 px-4 align-middle text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-2"
                          >
                            <Link href={`/dashboard/accounts/${account.id}`}>
                              관리 <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
