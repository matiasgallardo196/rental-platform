"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PricingRule {
  id: string
  name: string
  type: "weekend" | "season" | "event"
  multiplier: number
  enabled: boolean
}

export default function PricingPage() {
  const { toast } = useToast()
  const [rules, setRules] = useState<PricingRule[]>([
    {
      id: "1",
      name: "Weekend Premium",
      type: "weekend",
      multiplier: 1.2,
      enabled: true,
    },
    {
      id: "2",
      name: "Summer Season",
      type: "season",
      multiplier: 1.5,
      enabled: true,
    },
  ])

  const [newRule, setNewRule] = useState({
    name: "",
    type: "weekend" as const,
    multiplier: 1.0,
  })

  const addRule = () => {
    if (!newRule.name || newRule.multiplier <= 0) {
      toast({
        title: "Invalid rule",
        description: "Please fill in all fields correctly",
        variant: "destructive",
      })
      return
    }

    const rule: PricingRule = {
      id: Date.now().toString(),
      ...newRule,
      enabled: true,
    }

    setRules([...rules, rule])
    setNewRule({ name: "", type: "weekend", multiplier: 1.0 })

    toast({
      title: "Rule added",
      description: "Pricing rule has been created",
    })
  }

  const toggleRule = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
    toast({
      title: "Rule deleted",
      description: "Pricing rule has been removed",
    })
  }

  return (
    <div className="container mx-auto min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dynamic Pricing</h1>
          <p className="text-muted-foreground">Configure pricing rules for different periods</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Pricing Rule</CardTitle>
              <CardDescription>Create rules to adjust prices automatically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Holiday Premium"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newRule.type} onValueChange={(value: any) => setNewRule({ ...newRule, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekend">Weekend</SelectItem>
                      <SelectItem value="season">Season</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="multiplier">Price Multiplier</Label>
                  <Input
                    id="multiplier"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="1.0"
                    value={newRule.multiplier}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        multiplier: Number.parseFloat(e.target.value) || 1.0,
                      })
                    }
                  />
                </div>
              </div>

              <Button onClick={addRule} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Rules</CardTitle>
              <CardDescription>Manage your pricing rules</CardDescription>
            </CardHeader>
            <CardContent>
              {rules.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No pricing rules configured</p>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                          <div>
                            <p className="font-medium">{rule.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)} • {rule.multiplier}x multiplier
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" onClick={() => deleteRule(rule.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
