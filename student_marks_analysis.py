"""
Student Marks Analysis using Apache Spark (PySpark)
This program analyzes student marks data using Spark DataFrames
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import col, avg, max, min, count, round, when, sum as spark_sum
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, FloatType
import os

# Initialize Spark Session
spark = SparkSession.builder \
    .appName("Student Marks Analysis") \
    .master("local[*]") \
    .getOrCreate()

print("=" * 60)
print("STUDENT MARKS ANALYSIS USING APACHE SPARK")
print("=" * 60)

# Define schema for student data
schema = StructType([
    StructField("student_id", IntegerType(), True),
    StructField("name", StringType(), True),
    StructField("class", StringType(), True),
    StructField("math", IntegerType(), True),
    StructField("science", IntegerType(), True),
    StructField("english", IntegerType(), True),
    StructField("social", IntegerType(), True),
    StructField("computer", IntegerType(), True)
])

# Sample student data
data = [
    (101, "John Smith", "10A", 85, 92, 78, 88, 90),
    (102, "Emma Wilson", "10A", 92, 88, 85, 90, 95),
    (103, "Michael Brown", "10B", 78, 82, 75, 80, 85),
    (104, "Sophia Davis", "10A", 95, 98, 92, 94, 96),
    (105, "James Johnson", "10B", 82, 85, 80, 83, 88),
    (106, "Olivia Martinez", "10A", 88, 90, 86, 89, 91),
    (107, "William Garcia", "10B", 75, 78, 72, 76, 80),
    (108, "Ava Anderson", "10A", 90, 93, 88, 91, 94),
    (109, "Ethan Taylor", "10B", 80, 83, 78, 81, 85),
    (110, "Isabella Thomas", "10A", 87, 89, 84, 86, 90),
    (111, "Mason Lee", "10B", 92, 95, 90, 93, 96),
    (112, "Charlotte White", "10A", 83, 86, 81, 84, 87),
    (113, "Lucas Harris", "10B", 76, 79, 74, 77, 81),
    (114, "Amelia Clark", "10A", 94, 96, 91, 93, 97),
    (115, "Henry Lewis", "10B", 81, 84, 79, 82, 86)
]

# Create DataFrame
df = spark.createDataFrame(data, schema)

print("\n1. ORIGINAL STUDENT DATA")
print("-" * 60)
df.show()

# Calculate total marks and percentage
df_with_total = df.withColumn(
    "total_marks",
    col("math") + col("science") + col("english") + col("social") + col("computer")
).withColumn(
    "percentage",
    round((col("total_marks") / 5), 2)
)

# Add grade column
df_with_grade = df_with_total.withColumn(
    "grade",
    when(col("percentage") >= 90, "A+")
    .when(col("percentage") >= 80, "A")
    .when(col("percentage") >= 70, "B")
    .when(col("percentage") >= 60, "C")
    .when(col("percentage") >= 50, "D")
    .otherwise("F")
)

# Add pass/fail status
df_final = df_with_grade.withColumn(
    "status",
    when(
        (col("math") >= 40) & 
        (col("science") >= 40) & 
        (col("english") >= 40) & 
        (col("social") >= 40) & 
        (col("computer") >= 40) & 
        (col("percentage") >= 50),
        "PASS"
    ).otherwise("FAIL")
)

print("\n2. STUDENT MARKS WITH TOTAL, PERCENTAGE & GRADE")
print("-" * 60)
df_final.select("student_id", "name", "class", "total_marks", "percentage", "grade", "status").show()

# Overall Statistics
print("\n3. OVERALL STATISTICS")
print("-" * 60)
overall_stats = df_final.agg(
    round(avg("math"), 2).alias("Avg_Math"),
    round(avg("science"), 2).alias("Avg_Science"),
    round(avg("english"), 2).alias("Avg_English"),
    round(avg("social"), 2).alias("Avg_Social"),
    round(avg("computer"), 2).alias("Avg_Computer"),
    round(avg("percentage"), 2).alias("Avg_Percentage")
)
overall_stats.show()

# Subject-wise highest and lowest marks
print("\n4. SUBJECT-WISE HIGHEST & LOWEST MARKS")
print("-" * 60)
subject_stats = df_final.agg(
    max("math").alias("Max_Math"),
    min("math").alias("Min_Math"),
    max("science").alias("Max_Science"),
    min("science").alias("Min_Science"),
    max("english").alias("Max_English"),
    min("english").alias("Min_English")
)
subject_stats.show()

# Class-wise analysis
print("\n5. CLASS-WISE PERFORMANCE ANALYSIS")
print("-" * 60)
class_analysis = df_final.groupBy("class").agg(
    count("student_id").alias("Total_Students"),
    round(avg("percentage"), 2).alias("Avg_Percentage"),
    max("percentage").alias("Highest_Percentage"),
    min("percentage").alias("Lowest_Percentage")
).orderBy("class")
class_analysis.show()

# Grade distribution
print("\n6. GRADE DISTRIBUTION")
print("-" * 60)
grade_distribution = df_final.groupBy("grade").agg(
    count("student_id").alias("Number_of_Students")
).orderBy("grade")
grade_distribution.show()

# Pass/Fail analysis
print("\n7. PASS/FAIL ANALYSIS")
print("-" * 60)
pass_fail = df_final.groupBy("status").agg(
    count("student_id").alias("Count")
)
pass_fail.show()

# Top 5 students
print("\n8. TOP 5 STUDENTS")
print("-" * 60)
top_students = df_final.select("student_id", "name", "class", "percentage", "grade") \
    .orderBy(col("percentage").desc()) \
    .limit(5)
top_students.show()

# Students who need improvement (below 70%)
print("\n9. STUDENTS NEEDING IMPROVEMENT (Below 70%)")
print("-" * 60)
low_performers = df_final.filter(col("percentage") < 70) \
    .select("student_id", "name", "class", "percentage", "grade")
low_performers.show()

# Subject-wise toppers
print("\n10. SUBJECT-WISE TOPPERS")
print("-" * 60)

# Math topper
math_topper = df_final.orderBy(col("math").desc()).select("name", "class", "math").limit(1)
print("Math Topper:")
math_topper.show()

# Science topper
science_topper = df_final.orderBy(col("science").desc()).select("name", "class", "science").limit(1)
print("Science Topper:")
science_topper.show()

# Computer topper
computer_topper = df_final.orderBy(col("computer").desc()).select("name", "class", "computer").limit(1)
print("Computer Topper:")
computer_topper.show()

# Students failed in any subject
print("\n11. STUDENTS WHO FAILED IN ANY SUBJECT (Marks < 40)")
print("-" * 60)
failed_students = df_final.filter(
    (col("math") < 40) | 
    (col("science") < 40) | 
    (col("english") < 40) | 
    (col("social") < 40) | 
    (col("computer") < 40)
).select("student_id", "name", "math", "science", "english", "social", "computer")

if failed_students.count() > 0:
    failed_students.show()
else:
    print("No students failed in any subject!")

# Save results to CSV
print("\n12. SAVING RESULTS")
print("-" * 60)

# Save complete report
output_dir = "student_analysis_output"
df_final.coalesce(1).write.mode("overwrite").csv(output_dir + "/complete_report", header=True)
print(f"✓ Complete report saved to: {output_dir}/complete_report")

# Save class-wise analysis
class_analysis.coalesce(1).write.mode("overwrite").csv(output_dir + "/class_analysis", header=True)
print(f"✓ Class analysis saved to: {output_dir}/class_analysis")

# Save grade distribution
grade_distribution.coalesce(1).write.mode("overwrite").csv(output_dir + "/grade_distribution", header=True)
print(f"✓ Grade distribution saved to: {output_dir}/grade_distribution")

print("\n" + "=" * 60)
print("ANALYSIS COMPLETED SUCCESSFULLY!")
print("=" * 60)

# Stop Spark Session
spark.stop()
