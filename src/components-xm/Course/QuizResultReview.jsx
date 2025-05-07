import {useEffect} from "react";

export default function QuizResultReview({ result, questionMap }) {

    useEffect(() => {
        console.log(result);
        console.log(questionMap);

    }, [ ]);

    return (
        <div className="space-y-6">
             <h2 className="text-2xl font-bold">Result</h2>
            <p className="text-lg">You scored <strong>{result?.quizResultPoint}</strong> out of <strong>{result?.totalPoints }</strong>.</p>

            {result?.quizResultSnapshot?.map((q, index) => {
                const question = questionMap[q.quizQuestionId]; // you need a map of questions
                return (
                    <div key={q.quizQuestionId} className="p-4 border rounded-xl">
                        <h3 className="font-semibold">{index + 1}. {question?.quizQuestionTitle || "Question"}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                            {q.isAnswerCorrect ? "✅ Correct" : "❌ Incorrect"}
                        </p>
                        <p className="text-sm">Your answers: {q.answerList.join(", ")}</p>
                        {question?.quizQuestionCorrectAnswer && (
                            <p className="text-sm text-green-700">
                                Correct answers: {question.quizQuestionCorrectAnswer.join(", ")}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
