import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { AlertCircle, CheckCircle, Loader2, FileText } from 'lucide-react'

const AnalysisDemo = () => {
  const [analysisText, setAnalysisText] = useState('')
  const [analysisType, setAnalysisType] = useState('grammar_spelling')
  const [language, setLanguage] = useState('english')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)

  const sampleTexts = {
    english: "The students was very happy with there test results. They recieve good grades and was excited to share the news with there parents. Me and my friend decided to celebrate at the libary.",
    urdu: "یہ ایک نمونہ متن ہے جس میں کچھ غلطیاں ہو سکتی ہیں۔",
    spanish: "Los estudiantes estaba muy feliz con sus resultados. Ellos recibio buenas notas.",
    french: "Les étudiants était très heureux avec leurs résultats. Ils a reçu de bonnes notes."
  }

  const handleAnalyze = async () => {
    if (!analysisText.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: analysisText,
          analysis_type: analysisType,
          language: language
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (err) {
      setError('Failed to analyze text. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const loadSampleText = () => {
    setAnalysisText(sampleTexts[language] || sampleTexts.english)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Try Paper Analyzer</span>
          </CardTitle>
          <CardDescription>
            Test our AI-powered document analysis with your own text or use our sample
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text to Analyze
            </label>
            <textarea
              value={analysisText}
              onChange={(e) => setAnalysisText(e.target.value)}
              placeholder="Enter your text here or click 'Load Sample Text' below..."
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Type
              </label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="grammar_spelling">Grammar & Spelling</option>
                <option value="grammar_only">Grammar Only</option>
                <option value="spelling_only">Spelling Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="english">English</option>
                <option value="urdu">Urdu</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={loadSampleText}
                className="w-full"
              >
                Load Sample Text
              </Button>
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !analysisText.trim()}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Text'
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results</span>
              <Badge variant={analysisResult.total_mistakes > 0 ? "destructive" : "default"}>
                {analysisResult.total_mistakes} mistakes found
              </Badge>
            </CardTitle>
            <CardDescription>
              Analysis completed for {analysisResult.text_length} characters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult.total_mistakes === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Great job! No mistakes found.
                </h3>
                <p className="text-gray-600">
                  Your text appears to be error-free based on the selected analysis type.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Mistakes Found:</h4>
                {analysisResult.mistakes.map((mistake, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {mistake.type}
                      </Badge>
                      <span className="text-sm text-gray-500">{mistake.position}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-red-600">Original: </span>
                        <span className="text-sm bg-red-100 px-2 py-1 rounded">
                          {mistake.original}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-green-600">Corrected: </span>
                        <span className="text-sm bg-green-100 px-2 py-1 rounded">
                          {mistake.corrected}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{mistake.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AnalysisDemo

