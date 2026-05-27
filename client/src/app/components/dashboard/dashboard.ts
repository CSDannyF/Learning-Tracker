import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card'
import { 
  NgApexchartsModule,
  ApexAxisChartSeries, 
  ApexChart,
  ApexTitleSubtitle, 
  ApexXAxis, 
  ApexYAxis } from 'ng-apexcharts'

import { CategoryService } from '../../services/category-service';
import { ActivityService } from '../../services/activity-service';
import { Category } from '../../models/category';
import { Activity } from '../../models/activity';
import { TopicStatus } from '../../models/topic-status';
import { ApexDataLabels, ApexNonAxisChartSeries, ApexTooltip } from 'apexcharts';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  tooltip?: ApexTooltip;
  colors?: string[]
}

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard  implements OnInit {

  constructor(private categoryService: CategoryService, private activityService: ActivityService, private cdr: ChangeDetectorRef) {}

  categories: Category[] = [];
  activities: Activity[]= [];

  topicsInSKill: number = 0;
  totalKnownSkills: number = 0;
  totalKnownTopics: number = 0;

  skillsInProgress: number = 0;
  learningStreak: number = 0;

  chartOptions: Partial<ChartOptions> = {};
  lineChartOptions: Partial<ChartOptions> = {};

  async ngOnInit(): Promise<void> {
    this.categories = await this.categoryService.getCategories();
    this.activities = await this.activityService.getAllActivities();
    this.calculateTotalKnownSkills();
    this.calculateSkillsInProgress();
    this.calculateLearningStreak();
    this.calculateTotalKnownTopics();
    this.buildRadarChart();
    this.buildLineChart();
    this.cdr.detectChanges();
  }

  calculateSkillsInProgress() {
    this.categories.forEach(cat => {
      cat.skills.forEach(skill => {
        if (skill.topics.find(topic => topic.status === TopicStatus.InProgress)) { 
          return this.skillsInProgress++ 
        } else {
          return 
        };
      })
    })
  }

  calculateTotalKnownSkills() {
    this.categories.forEach(cat => {
      cat.skills.forEach(skill => {
        if (skill.topics.length > 0 && skill.topics.every(topic => topic.status === TopicStatus.Done)) this.totalKnownSkills++;
      })
    })
  }

  calculateTotalKnownTopics() {
    this.categories.forEach(cat => {
      cat.skills.forEach(skill => {
        skill.topics.forEach(topic => {
          if (topic.status === TopicStatus.Done) this.totalKnownTopics++;
        })
      })
    })
  }

  // Alle activiteiten mappen als string
  // Set verwijderd duplicaten, de spread [...] zet de set om naar een array
  // De vergelijking begint vandaag, we kijken als als deze datum in de lijst zit. Zo ja teller +1 en gaan we 1 dag terug. totdat we geen match hebben, dat is de streak
  calculateLearningStreak() {
    const dateStrings = [...new Set(
      this.activities.map(a => new Date(a.date).toDateString())
    )];

    let today = new Date();

    while (dateStrings.includes(today.toDateString())) {
      this.learningStreak++;
      today.setDate(today.getDate() -1);
    }
  }

  // https://apexcharts.com/angular-chart-demos/radar-charts/basic-radar/
  buildRadarChart() {
    const knownTopicsPerCategory = new Map();

    this.categories.map(c => {
      this.topicsInSKill = 0;
      let knownTopics = 0;
      c.skills.forEach(s => {
        this.topicsInSKill += s.topics.length;
        s.topics.forEach(t => {
          if (t.status === TopicStatus.Done) knownTopics++;
          else return;
        })
      })
      knownTopicsPerCategory.set(c.name, (Math.round(knownTopics/this.topicsInSKill *100)))
    })


    this.chartOptions = {
    series: [{
      name: 'Percentage done',
      data: [...knownTopicsPerCategory.values()]
    }],
    chart: {
      height: 600,
      type: 'radar'
    },
    title: {
      text: 'Learning radar chart' 
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
    },
    xaxis: {
      categories: [...knownTopicsPerCategory.keys()],
    },
    // https://apexcharts.com/docs/options/tooltip/
    tooltip: {
      y: {
        formatter: function(val) {
          return val + "%";
        }
      }
    }
  };
  }

  buildLineChart() {
    const startedTopicsPerMonth = new Map();
    const finishedTopicsPerMonth = new Map();
    const today = new Date();
    console.log(today.getFullYear())

    for (let i = 0; i < 12; i++) {
      startedTopicsPerMonth.set(i, 0);
      finishedTopicsPerMonth.set(i, 0);
    }

    this.categories.forEach(c => {
      c.skills.forEach(s => {
        s.topics.forEach(t => {
          if (t.status != TopicStatus.NotStarted && t.startDate) {
            let date = new Date(t.startDate);
            startedTopicsPerMonth.set(date.getMonth(), startedTopicsPerMonth.get(date.getMonth() ?? 0) + 1);
          }      

          if (t.status === TopicStatus.Done && t.endDate) {
            let date = new Date(t.endDate);
            finishedTopicsPerMonth.set(date.getMonth(),
            finishedTopicsPerMonth.get(date.getMonth() ?? 0) +1);
          }
        })
      })
    })


    this.lineChartOptions = {
      series: [
        {
          name: 'Started Topics',
          data: [...startedTopicsPerMonth.values()],
        },
        {
          name: 'Finished Topics',
          data: [...finishedTopicsPerMonth.values()],
        }
      ],
          title: {
      text: 'Monthly Topic Progression' 
    },
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
      },
      colors: ['#b045ee', '#549bd4'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        title: {
          text: 'Month',
        },
      },
      yaxis: {
        title: {
          text: 'Topic'
        }
      },
    }
  }

}
