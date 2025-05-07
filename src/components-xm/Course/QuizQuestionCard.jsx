import {useEffect, useState} from "react";
import {Card} from "@/components/ui/card.jsx";
import {Checkbox} from "@/components/ui/checkbox.jsx";

export default function QuizQuestionCard({ question, onAnswerChange }) {
    const [selected, setSelected] =useState([])

    const toggleOption = (option) => {
        setSelected((prev) =>
            prev.includes(option)
                ? prev.filter((o) => o !== option)
                : [...prev, option]
        );
    };

    useEffect(() => {
        onAnswerChange(question.quizQuestionId, selected);
    }, [selected]);

    return (
        <Card className="w-full mx-auto my-8 p-0 border-none">
            <div>
                <h2 className="text-xl font-bold mb-2">{question.quizQuestionTitle}</h2>
                {question.quizQuestionNote && (
                    <p className="text-sm text-muted-foreground mb-4">
                        Note: {question.quizQuestionNote}
                    </p>
                )}
                <div className="flex gap-3">
                    {question.quizQuestionPosPoint && (
                        <p className="text-sm text-muted-foreground mb-4 text-blue-700">
                            Correct Marks: + {question.quizQuestionPosPoint}
                        </p>
                    )}

                    {question.quizQuestionNegPoint && (
                        <p className="text-sm text-muted-foreground mb-4 text-red-600">
                            Wrong Marks: - {question.quizQuestionNegPoint}
                        </p>
                    )}
                </div>


                <div className="space-y-3">
                    {question.quizQuestionOption.map((option) => (
                        <div key={option} className="flex items-center gap-2 p-2 rounded-md border">
                            <Checkbox
                                id={option}
                                checked={selected.includes(option)}
                                onCheckedChange={() => toggleOption(option)}
                            />
                            <label htmlFor={option} className="text-base">{option}</label>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
