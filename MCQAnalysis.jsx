import React, { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { FileText, Upload, CheckCircle, AlertCircle, BarChart3, Users, Target } from 'lucide-react'

const MCQAnalysis = ({ userPlan = 'free' }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [answerKey, setAnswerKey] = useState('')
  const [studentAnswers, setStudentAnswers] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [error, setError] = useState(null)

  // Get MCQ limits based on plan
  const getMCQLimit = (plan) => {
    const limits = {
      'free': 0,
      'basic': 0,
      'standard': 200,
      'premium': 500
    }
    return limits[plan.toLowerCase()] || 0
  }

  const mcqLimit = getMCQLimit(userPlan)

  const handleAnswerKeyUpload = () => {
    if (!answerKey.trim()) {
      setError('Please enter the answer key')
      return
    }

    try {
      // Parse answer key (expecting comma-separated values like: A,B,C,D,A,B...)
      const answers = answerKey.split(',').map(answer => answer.trim().toUpperCase())
      
      if (answers.length === 0) {
        setError('Please provide valid answers separated by commas')
        return
      }

      setError(null)
      setCurrentStep(2)
    } catch (err) {
      setError('Invalid answer key format. Please use comma-separated values (e.g., A,B,C,D)')
    }
  }

  const handleBatchAnalysis = async () => {
    if (!studentAnswers.trim()) {
      setError('Please enter student answers')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      // Parse student answers (expecting multiple lines, each line is one student's answers)
      const studentLines = studentAnswers.split('\n').filter(line => line.trim())
      const answerKeyArray = answerKey.split(',').map(answer => answer.trim().toUpperCase())
      
      if (studentLines.length > mcqLimit) {
        setError(`Your ${userPlan} plan allows maximum ${mcqLimit} MCQ analyses. You provided ${studentLines.length} student sheets.`)
        setIsAnalyzing(false)
        return
      }

      // Process each student's answers
      const studentAnswerSheets = studentLines.map((line, index) => {
        const answers = line.split(',').map(answer => answer.trim().toUpperCase())
        const answerDict = {}
        answers.forEach((answer, qIndex) => {
          answerDict[qIndex + 1] = answer
        })
        return answerDict
      })

      const response = await fetch('http://localhost:5001/api/analyze-mcq-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer_key_id: 'temp_key_' + Date.now(),
          answer_key: answerKeyArray.map((answer, index) => ({
            question_number: index + 1,
            correct_answer: answer
          })),
          student_answers: studentAnswerSheets,
          user_plan: userPlan
        })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
      setCurrentStep(3)
    } catch (err) {
      setError('Failed to analyze MCQ sheets. Please try again.')
      console.error('MCQ Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setCurrentStep(1)
    setAnswerKey('')
    setStudentAnswers('')
    setAnalysisResult(null)
    setError(null)
  }

  if (mcqLimit === 0) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Target className="h-5 w-5" />
            <span>MCQ Analysis</span>
          </CardTitle>
          <CardDescription>
            Bulk analyze multiple choice question answer sheets
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            MCQ Analysis Not Available
          </h3>
          <p className="text-gray-600 mb-4">
            MCQ analysis is available for Standard ($22/month) and Premium ($30/month) plans only.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Standard Plan: 200 MCQ analyses per month</p>
            <p>• Premium Plan: 500 MCQ analyses per month</p>
          </div>
          <Button className="mt-6">
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>MCQ Analysis</span>
            </div>
            <Badge variant="outline">
              {mcqLimit} analyses available
            </Badge>
          </CardTitle>
          <CardDescription>
            Upload answer key and analyze multiple student answer sheets
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Step 1: Answer Key Upload */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              <span>Upload Answer Key</span>
            </CardTitle>
            <CardDescription>
              Enter the correct answers separated by commas (e.g., A,B,C,D,A,B)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Key
              </label>
              <textarea
                value={answerKey}
                onChange={(e) => setAnswerKey(e.target.value)}
                placeholder="A,B,C,D,A,B,C,D,A,B..."
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter answers separated by commas. Example: A,B,C,D for a 4-question test
              </p>
            </div>

            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <Button onClick={handleAnswerKeyUpload} className="w-full">
              Continue to Student Answers
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Student Answers Upload */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              <span>Upload Student Answers</span>
            </CardTitle>
            <CardDescription>
              Enter each student's answers on a separate line (max {mcqLimit} students)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Answer Sheets
              </label>
              <textarea
                value={studentAnswers}
                onChange={(e) => setStudentAnswers(e.target.value)}
                placeholder={`Student 1: A,B,C,D,A,B\nStudent 2: A,C,C,D,B,B\nStudent 3: B,B,C,A,A,B\n...`}
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Each line represents one student's answers. Maximum {mcqLimit} students for your {userPlan} plan.
              </p>
            </div>

            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back to Answer Key
              </Button>
              <Button 
                onClick={handleBatchAnalysis} 
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyze MCQ Sheets
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Results */}
      {currentStep === 3 && analysisResult && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  <span>Analysis Results</span>
                </div>
                <Button variant="outline" onClick={resetAnalysis}>
                  New Analysis
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisResult.total_sheets_analyzed}
                  </div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {analysisResult.summary?.average_percentage?.toFixed(1) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {analysisResult.summary?.highest_score || 0}
                  </div>
                  <div className="text-sm text-gray-600">Highest Score</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {analysisResult.summary?.lowest_score || 0}
                  </div>
                  <div className="text-sm text-gray-600">Lowest Score</div>
                </div>
              </div>

              {/* Individual Results */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Individual Student Results:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analysisResult.individual_results?.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">Student {result.student_id}</span>
                        <Badge variant={result.grade === 'A+' || result.grade === 'A' ? 'default' : 
                                      result.grade === 'B+' || result.grade === 'B' ? 'secondary' : 'destructive'}>
                          {result.grade}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {result.score}/{result.total_questions}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.score_percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default MCQAnalysis

