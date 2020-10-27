import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import {Block} from './block';

class Person extends React.Component {
	render() {
		
		return (
			<div className={(this.props.highlight ? "bg-info" : "")} name={this.props.id}>
				<Block 
					image={this.props.app.getWebRoot() + "/images/headshots/mug-" + this.props.id + ".jpg"}
					alt={"Photograph of " + this.props.name}
					link={this.props.url}
					header={null}
					content={
						<span>
							<a target="_blank" href={this.props.url}>{this.props.name}</a>
							&nbsp;
							<mark>{this.props.level}</mark>
							&nbsp;
							<small>{ this.props.startdate }{ this.props.enddate ? (this.props.startdate !== this.props.enddate ? " - " + this.props.enddate : null) : " - present" }</small>
							<br/>
							{this.props.bio}
							{
								this.props.dissertation ?
									<div className="border-top">
										<small>
											{ this.props.dissertation ? <a href={this.props.app.getWebRoot() + "/dissertations/" + this.props.dissertation}>Dissertation</a> : null }
										</small>
									</div> : null
							}
						</span>
					}
				/>
			</div>
		);
		
	}
}

class Lab extends React.Component {

	componentDidMount() {
		
		var personToHighlight = this.props.match.params.person;

		var highlight = $('[name=' + personToHighlight + ']');
		
		// Now scroll to the highlight, if there is one.
		if(highlight.length > 0)
			$('html,body').animate({scrollTop:highlight.offset().top - $(window).height() / 2}, 300);
		
	}

	render() {
		
		var personToHighlight = this.props.match.params.person;

		const renderPeople = (filter, sort) =>
			_.map(
				this.props.profile.getPeople(filter, sort), 
				person => 
					<Person {...person} 
						key={person.id} 
						highlight={personToHighlight === person.id} 
						app={this.props.app}
					/>
			);

		return (
			<div>
			
				<div className="lead">
					I direct the <em>Code & Cognition Lab</em>.
				</div>
				
				<p>
					My lab includes students from <a href="http://ischool.uw.edu">The Information School</a>, <a href="http://cs.washington.edu">The Paul G. Allen School of Computer Science & Engineering</a>, the <a href="https://education.uw.edu">College of Education</a>, and occasionally other units on campus.
					I run the lab in a doctoral student-centered manner: students define their own projects within the scope of my interests, and often move me into new research areas. 
					Read our <a href="https://docs.google.com/document/d/1LMHv0HdxXEgSNqICt3wtq8xWuH73kP7plZ_KeXyP6qM/edit?usp=sharing">onboarding document</a> for more details about the ever evolving culture of the lab.
				</p>

				<div className="row">
					<div className="col-sm-4">
						<p><strong>Current UW Ph.D. student?</strong> Lurk in <i>#codeandcognitionlab</i> on <a target="_blank" href="https://computinged-uw.slack.com">ComputingEd@UW</a> Slack. DM or email me about your interests and perhaps we'll meet.</p>
					</div>
					<div className="col-sm-4">
						<p><strong>Future UW Ph.D. student?</strong> Read my <Link to="/cer">CER FAQ</Link> to ensure we share interests. Talk to my current students about their experiences. Apply to the <a href="http://ischool.uw.edu/phd" target="_blank">iSchool</a> or <a href="http://www.cs.washington.edu/education/grad/prospective.html" target="_blank">CSE</a> in Autumn.</p>
					</div>
					<div className="col-sm-4">
						<p><strong>Current UW undergrad?</strong> Read about <a href="https://ischool.uw.edu/programs/informatics/research">engaging in undergrad research</a>. <a href="https://docs.google.com/forms/d/e/1FAIpQLSdjcrMFAMUEv3SXXggXscg17sIZ6p7YFSpCkFPADkBZ8BZB9g/viewform?usp=sf_link" target="_blank">Apply</a> to my lab. I recruit for part-time researchers and in Winter for summer positions.</p>
					</div>
				</div>
				
				<h3>Current Advisees</h3>
				{ 
					renderPeople(
						person => person.active && person.advised && person.id !== "ajko" && person.level !== "faculty", 
						person => {
							return { "undergrad": 5, "masters": 4, "phd": 3, "postdoc": 2, "faculty": 1 }[person.level] * 10000 + person.startdate
						}
					)
				}

				<h3>Affiliated Ph.D. students</h3>
				{ 
					renderPeople(
						person => person.active && !person.advised && person.level !== "faculty", 
						['level', 'startdate']
					) 
				}

				<h3 id="collaborators">Faculty Collaborators</h3>

				<p><em>This isn't a complete list of collaborators, just those I've gotten around to adding.</em></p>
				{ 
					renderPeople(
						person => person.active && person.level === "faculty", 
						person => -person.startdate
					) 
				}

				<h3>Former Ph.D. students</h3>
				{ 
					renderPeople(
						person => person.enddate !== null && !person.active && person.advised && person.level === "phd", 
						person => -person.enddate
					)
				}

				<h3>Former Affiliated Ph.D. students</h3>
				{
					renderPeople(
						person => !person.active && !person.advised && person.level === "phd",
						person => -person.startdate
					)
				}

				<h3>Former Postdocs</h3>
				{
					renderPeople(
						person => !person.active && person.level === "postdoc",
						person => -person.startdate
					)
				}

				<h3>Former Undergrads</h3>
				{
					renderPeople(
						person => !person.active && person.level === "undergrad",
						person => -person.startdate
					)
				}
				
			</div>
		);
	}
}

export { Lab };