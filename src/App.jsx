import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'

function App() {
  const [productUrl, setProductUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (productUrl.trim()) {
      console.log('Product URL:', productUrl)
      // Here you would typically process the URL
      alert(`Processing product URL: ${productUrl}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Product URL Analyzer</CardTitle>
          <CardDescription>
            Paste a product URL below to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://example.com/product"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!productUrl.trim()}
            >
              Analyze Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
